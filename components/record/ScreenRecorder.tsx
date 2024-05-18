"use client"
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Session, Interview } from '@/app/types/database';
import { usePathname, useRouter } from 'next/navigation';

export default function ScreenRecorder({ sessionID, interviewID }: { sessionID: Session["id"], interviewID: Interview["id"] }) {
    const supabase = createClient();
    const path = usePathname();
    const router = usePathname();
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const recorder = new MediaRecorder(stream);

            recorder.ondataavailable = (e) => {
                setRecordedBlob(e.data);
                setShowSaveButton(true);
            };

            recorder.start();
            setRecording(true);
            setMediaRecorder(recorder);
        } catch (error) {
            console.error("Erreur lors du démarrage de l'enregistrement de l'écran", error);
        }
    };

    const stopRecording = () => {
        if (!mediaRecorder) return;
        mediaRecorder.stop();
        setRecording(false);
    };

    const saveRecording = async () => {
        if (!recordedBlob) return;

        // const file = new File([recordedBlob], 'screenRecording.webm', { type: recordedBlob.type });
        const file = new File([recordedBlob], 'screenRecording.mp4', { type: 'video/mp4' });
        // const { data, error } = await supabase.storage.from('interviews').upload(`interviews/${sessionID}/${interviewID}/raw/raw.webm`, file);
        const { error } = await supabase.storage.from('interviews').upload(`/interviews/${sessionID}/${interviewID}/raw/raw.mp4`, file);

        if (error) {
            console.error("Erreur lors de l'upload de l'enregistrement", error);
        } else {
            console.log("Enregistrement sauvegardé avec succès:");
            await supabase.from("interviews").update({'raw_file_ok': true}).filter('id', 'eq', interviewID);
            // TODO QUERY API DANIEL HERE
        }
    };

    return (
        <div>
            <button
                onClick={!recording ? startRecording : stopRecording}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
                {!recording ? 'Start recording' : 'Stop recording'}
            </button>
            {showSaveButton && (
                <button
                    onClick={saveRecording}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Save Interview
                </button>
            )}
        </div>
    );
}
