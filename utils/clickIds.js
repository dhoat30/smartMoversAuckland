

const STORE_KEY = "ad_click_ids_v2";
const hasWindow = () => typeof window !== "undefined";
const hasDocument = () => typeof document !== "undefined";

function getCookie(name) {
  if (!hasDocument()) return "";
  const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[2]) : "";
}

// --- URL readers ---
function readFromUrl() {
  if (!hasWindow()) return {};
  const sp = new URLSearchParams(window.location.search);
  return {
    // Google
    gclid: sp.get("gclid") || undefined,
    gbraid: sp.get("gbraid") || undefined,
    wbraid: sp.get("wbraid") || undefined,
    // Meta
    fbclid: sp.get("fbclid") || undefined,
  };
}

// --- Cookie readers ---
function readGoogleFromCookie(){
  // _gcl_aw format: GCL.XXXX.YYYY.<gclid>
  const gcl = getCookie("_gcl_aw");
  let gclid ;
  if (gcl) {
    const parts = gcl.split(".");
    if (parts.length >= 4) gclid = parts[3];
  }
  return gclid ? { gclid } : {};
}

function readMetaFromCookie(){
  // Meta sets these if pixel with first-party cookies is active
  const fbp = getCookie("_fbp") || undefined;
  const fbc = getCookie("_fbc") || undefined;
  return { fbp, fbc };
}

// If URL has fbclid but _fbc is missing, construct it: fb.1.<ts>.<fbclid>
function buildFbcIfNeeded(ids)  {
  if (ids.fbc) return ids.fbc;
  if (!ids.fbclid) return undefined;
  const ts = Math.floor(Date.now() / 1000);
  return `fb.1.${ts}.${ids.fbclid}`;
}

export function readFromStorage() {
  if (!hasWindow()) return {};
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); }
  catch { return {}; }
}

export function persist(ids) {
  if (!hasWindow()) return;
  const clean = Object.fromEntries(Object.entries(ids).filter(([, v]) => !!v));
  localStorage.setItem(STORE_KEY, JSON.stringify(clean));
}

// Merge precedence: URL → Cookie → Storage
export function initClickIdsOnce() {
  const fromUrl = readFromUrl();
  const fromGoogleCookie = readGoogleFromCookie();
  const fromMetaCookie = readMetaFromCookie();
  const fromStorage = readFromStorage();

  const merged = {
    // Google
    gclid: fromUrl.gclid || fromGoogleCookie.gclid || fromStorage.gclid,
    gbraid: fromUrl.gbraid || fromStorage.gbraid,
    wbraid: fromUrl.wbraid || fromStorage.wbraid,
    // Meta
    fbclid: fromUrl.fbclid || fromStorage.fbclid,
    fbp: fromMetaCookie.fbp || fromStorage.fbp,
    fbc: fromMetaCookie.fbc || fromStorage.fbc,
  };

  // Create _fbc value if we only have fbclid
  merged.fbc = buildFbcIfNeeded(merged) || merged.fbc;

  persist(merged);
  return merged;
}
