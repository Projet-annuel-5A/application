'use client';

import { sendSignInvitation } from '@/functions/agreement';

interface SendInvitationButtonProps {
    docID: string;
    candidateEmail: string;
    candidatePhone: string;
    transmitterEmail: string | undefined;
    transmitterName: string | undefined;
}

const SendInvitationButton: React.FC<SendInvitationButtonProps> = ({ docID, candidateEmail, candidatePhone, transmitterEmail, transmitterName }) => {

    console.log(transmitterEmail)

    const handleClick = () => {

        console.log(docID, candidateEmail , transmitterEmail , transmitterName)

        sendSignInvitation({
            docID,
            candidateEmail,
            candidatePhone: candidatePhone,
            transmitterEmail: transmitterEmail,
            transmitterName: transmitterName
        });
    };

    return (
        <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
            onClick={handleClick}
        >
            Send back invitation
        </button>
    );
}

export default SendInvitationButton;
