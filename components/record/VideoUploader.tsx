"use client"
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Session, Interview } from '@/app/types/database';
import { usePathname, useRouter } from 'next/navigation';



export default function VideoUploader({ sessionID, interviewID }: { sessionID: Session["id"], interviewID: Interview["id"]}) {
    const supabase = createClient();
    const router = useRouter();
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // POC CODE OF AN INTERNAL VIDEO RECORDER

    // const [recording, setRecording] = useState(false);
    // const [mediaRecorder, setMediaRecorder] = useState<any>(null);
    // const startRecording = async () => {
    //     try {
    //         const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    //         const recorder = new MediaRecorder(stream) as any;

    //         recorder.ondataavailable = (e: any) => {
    //             setRecordedBlob(e.data);
    //             setShowSaveButton(true);
    //         };

    //         recorder.start();
    //         setRecording(true);
    //         setMediaRecorder(recorder);
    //     } catch (error) {
    //         console.error("Erreur lors du démarrage de l'enregistrement de l'écran", error);
    //     }
    // };

    // const stopRecording = () => {
    //     if (!mediaRecorder) return;
    //     mediaRecorder.stop();
    //     setRecording(false);
    // };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setRecordedBlob(file);
            setShowSaveButton(true);
        }
    };

    const saveRecording = async () => {
        if (!recordedBlob) return;

        setIsSaving(true);

        const file = new File([recordedBlob], 'screenRecording.mp4', { type: 'video/mp4' });
        const { error } = await supabase.storage.from('interviews').upload(`${sessionID}/${interviewID}/raw/raw.mp4`, file);

        if (error) {
            console.error("Erreur lors de l'upload de l'enregistrement", error);
        } else {
            console.log("Enregistrement sauvegardé avec succès:");
            await supabase.from("interviews").update({ 'raw_file_ok': true }).filter('id', 'eq', interviewID);
            try {
                if (process.env.NEXT_PUBLIC_ENV === 'production') {
                    var url = `https://${process.env.NEXT_PUBLIC_MIDDLEWARE_IP}/preprocess`;
                } else {
                    var url = `http://${process.env.NEXT_PUBLIC_MIDDLEWARE_IP}:8000/preprocess`;
                }
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        session_id: Number(sessionID),
                        interview_id: Number(interviewID),
                    })
                });
                router.refresh();
            } catch (error) {
                console.error('error starting video processing', error)
            }
        }
    };

    return (
        <div className="w-3/6 h-full flex items-center justify-center p-8 bg-gradient-to-r flex-col rounded-xl shadow-md">
            <div className="flex flex-col items-center space-y-6 bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-gray-700">Upload a Video</h1>
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="upload-video"
                />
                <label
                    htmlFor="upload-video"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-md cursor-pointer transition duration-300"
                >
                    Select
                </label>
                {showSaveButton && (
                    <button
                        onClick={saveRecording}
                        className={`bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-md transition duration-300 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Uploading ...' : 'Save'}
                    </button>
                )}
            </div>
        </div>


    );
}
