import {
  getMetaFormName,
  getMetaGraphConfig,
  getMetaLead,
  listActiveMetaForms,
  listRecentFormLeads,
} from "./metaGraph.js";
import { mapMetaLeadToMoverMate } from "./metaLeadMapper.js";
import { createMetaLeadStore } from "./metaLeadStore.js";
import { createMoverMateLead } from "./moverMate.js";

function positiveInteger(value, fallback, maximum) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, maximum);
}

function processingError(error) {
  const safe = new Error("Meta lead processing failed.");
  safe.code = error?.code || "META_LEAD_PROCESSING_FAILED";
  safe.status = error?.status;
  safe.cause = error;
  return safe;
}

export function createMetaLeadProcessor({
  store = createMetaLeadStore(),
  fetchLead = getMetaLead,
  fetchFormName = getMetaFormName,
  sendToMoverMate = createMoverMateLead,
  listForms = listActiveMetaForms,
  listFormLeads = listRecentFormLeads,
  pageId = getMetaGraphConfig().pageId,
} = {}) {
  const maxAttempts = positiveInteger(process.env.META_LEAD_MAX_ATTEMPTS, 8, 20);
  const formNameCache = new Map();

  async function resolveFormName(formId) {
    if (!formId) return null;
    const key = String(formId);
    if (!formNameCache.has(key)) {
      formNameCache.set(key, Promise.resolve(fetchFormName(key)));
    }
    return formNameCache.get(key);
  }

  async function processLead(leadId, prefetchedLead) {
    const claim = await store.claim(String(leadId), { maxAttempts });
    if (!claim.claimed) {
      return {
        leadId: String(leadId),
        outcome:
          claim.reason === "processed" ? "already_processed" : claim.reason,
      };
    }

    let moverMateAccepted = false;
    try {
      const lead = prefetchedLead || (await fetchLead(String(leadId)));
      const formName = await resolveFormName(lead?.form_id);
      const moverMateLead = mapMetaLeadToMoverMate(lead, { formName, pageId });
      await sendToMoverMate(moverMateLead, {
        idempotencyKey: `meta-lead:${leadId}`,
        allowLegacyToken: false,
      });
      moverMateAccepted = true;
      await store.markProcessed(leadId, claim.token, claim.record);
      return { leadId: String(leadId), outcome: "processed" };
    } catch (error) {
      if (!moverMateAccepted) {
        await store.markFailed(leadId, claim.token, claim.record, error);
      }
      throw processingError(error);
    }
  }

  async function reconcile() {
    const lookbackHours = positiveInteger(
      process.env.META_RECONCILE_LOOKBACK_HOURS,
      24,
      168,
    );
    const maxLeads = positiveInteger(
      process.env.META_RECONCILE_MAX_LEADS,
      200,
      1000,
    );
    const candidateLeads = new Map();

    for (const leadId of await store.listDue({ limit: Math.min(maxLeads, 100) })) {
      candidateLeads.set(String(leadId), null);
    }

    const forms = await listForms();
    for (const form of forms) {
      if (form?.id) formNameCache.set(String(form.id), Promise.resolve(form.name || null));
    }
    const since = new Date(Date.now() - lookbackHours * 60 * 60 * 1000);
    for (const form of forms) {
      if (candidateLeads.size >= maxLeads) break;
      const remaining = maxLeads - candidateLeads.size;
      const leads = await listFormLeads(form.id, { since, maxLeads: remaining });
      for (const lead of leads) {
        if (lead?.id) candidateLeads.set(String(lead.id), lead);
      }
    }

    const summary = {
      forms: forms.length,
      candidates: candidateLeads.size,
      processed: 0,
      alreadyProcessed: 0,
      deferred: 0,
      failed: 0,
    };

    for (const [leadId, lead] of candidateLeads) {
      try {
        const result = await processLead(leadId, lead);
        if (result.outcome === "processed") summary.processed += 1;
        else if (result.outcome === "already_processed") {
          summary.alreadyProcessed += 1;
        }
        else summary.deferred += 1;
      } catch {
        summary.failed += 1;
      }
    }

    return summary;
  }

  return { processLead, reconcile };
}
