

import { NextResponse } from 'next/server'
import { parseJsonResponse } from '@/utils/fetchJson';
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const HUBSPOT_PORTAL_ID = process.env.HUBSPOT_PORTAL_ID;

export async function POST(req, res) {
    const { hubspotFormObject, hubspotFormID } = await req.json();


    var payload = JSON.stringify({
        "submittedAt": new Date().getTime(),
        "fields": hubspotFormObject,

        "legalConsentOptions": { // Include this object when GDPR options are enabled
            "consent": {
                "consentToProcess": true,
                "text": "I agree to allow Example Company to store and process my personal data.",
                "communications": [
                    {
                        "value": true,
                        "subscriptionTypeId": 999,
                        "text": "I agree to receive marketing communications from Example Company."
                    }
                ]
            }
        }
    })

    // hubspot request options
    var postOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: payload,
        redirect: 'follow'
    };

    try {
        // submit form
        const url = `https://api.hsforms.com/submissions/v3/integration/secure/submit/${HUBSPOT_PORTAL_ID}/${hubspotFormID}`;
        const response = await fetch(url, postOptions);
        const responseData = await parseJsonResponse(response, url, {
            requireOk: false,
        });

        if (!response.ok) {
            return NextResponse.json(
                { message: "HubSpot rejected the submission", success: false, data: responseData },
                { status: response.status },
            );
        }

        return NextResponse.json({ message: "This Worked", success: true, data: responseData });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "HubSpot submission failed", success: false },
            { status: 502 },
        );

    }
}

export async function GET(req, res) {
    const response = await res.json();
    return NextResponse.json( response);

};
