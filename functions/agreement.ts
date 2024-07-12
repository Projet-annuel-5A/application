"use server"
import { getUserServer, createClient } from "@/utils/supabase/server"

export async function sendAgreementRequest({ candidateLastName, candidateFirstName, candidateEmail, candidatePhone }:{ candidateLastName: string, candidateFirstName: string, candidateEmail: string, candidatePhone: string}) {
    const user = await getUserServer();

    const transmitterEmail = user?.email;
    const transmitterName = user?.email?.split("@")[0];
    // const transmitterName = "pierre";

    const documentID = await createDocFromModel(candidateLastName, candidateFirstName);
    console.log("documentID",documentID);

    await createDocSubscription(documentID);

    sendSignInvitation({
        docID: documentID,
        candidateEmail: candidateEmail,
        candidatePhone: candidatePhone,
        transmitterEmail: transmitterEmail as string,
        transmitterName: transmitterName as string,
    });

}

async function createDocFromModel(candidateLastName: string, candidateFirstName: string) {
    const url = `https://api.signnow.com/template/${process.env.NEXT_AGREEMENT_SERVICE_TEMPLATE_ID}/copy`;
    const payload = { "document_name": `Image usement agreement ${candidateLastName} ${candidateFirstName}` };
    const headers = {
        "Authorization": `Bearer ${process.env.NEXT_AGREEMENT_SERVICE_BEARER_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        const documentID = responseData.id;

        console.log("create doc from model",console.log(responseData),console.log(documentID),process.env.NEXT_AGREEMENT_SERVICE_TEMPLATE_ID, process.env.NEXT_AGREEMENT_SERVICE_BEARER_TOKEN);

        await updateInterviewAgreementDocID(documentID, candidateLastName, candidateFirstName);

        return documentID;
    } catch (error) {
        console.error('There was a problem with the doc creation fetch operation:', error);
    }
}

async function updateInterviewAgreementDocID(documentID: string, candidateLastName: string, candidateFirstName: string){
    const supabase = createClient();
    await supabase.from("interviews")
        .update({ 'agreement_doc_id': documentID })
        .filter('last_name', 'eq', candidateLastName)
        .filter('first_name', 'eq', candidateFirstName);

}

async function createDocSubscription(docID: string) {
    const url = "https://api.signnow.com/api/v2/events";
    const payload = {
        "event": "document.complete",
        "entity_id": docID,
        "action": "callback",
        "attributes": {
            "delete_access_token": true,
            "callback": process.env.NEXT_AGREEMENT_SERVICE_URL_CALLBACK,
            "use_tls_12": true,
            "docid_queryparam": true,
            "headers": {
                "string_head": "sample_text",
                "int_head": 12,
                "bool_head": false,
                "float_head": 12.24
            }
        }
    };
    const headers = {
        "Authorization": `Bearer ${process.env.NEXT_AGREEMENT_SERVICE_BEARER_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/json, "
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        console.log("doc subscription", await response.text(), process.env.NEXT_AGREEMENT_SERVICE_URL_CALLBACK, process.env.NEXT_AGREEMENT_SERVICE_BEARER_TOKEN);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

    } catch (error) {
        console.error('There was a problem with the doc creation fetch operation:', error);
    }
}


export async function sendSignInvitation({ docID, candidateEmail, candidatePhone, transmitterName, transmitterEmail }:{docID: string, candidateEmail: string, candidatePhone: string, transmitterName: string | undefined, transmitterEmail: string | undefined}){
    const url = `https://api.signnow.com/document/${docID}/invite`;
    const payload = {
        "document_id": docID,
        "to": [
            {
                "email": candidateEmail,
                "role_id": "",
                "role": "Recipient 1",
                "order": 1,
                "prefill_signature_name": "Recipient 1",
                "force_new_signature": 0,
                "reassign": "0",
                "decline_by_signature": "0",
                "reminder": 0,
                "expiration_days": 30,
                // "authentication_type": "phone",
                // "phone": candidatePhone,
                // "method": "sms",
                // "authentication_sms_message": "Your verification code is : {password}",
                "subject": "You have a document to sign",
                "message": `${transmitterName} invited you to sign a document`,
                "language": "fr"
            }
        ],
        "from": transmitterEmail
    }

    const headers = {
        "Authorization": `Bearer ${process.env.NEXT_AGREEMENT_SERVICE_BEARER_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        console.log("send sign invitation", await response.text(), process.env.NEXT_AGREEMENT_SERVICE_BEARER_TOKEN)

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

    } catch (error) {
        console.error('There was a problem with the sign invitation fetch operation:', error);
    }
}
