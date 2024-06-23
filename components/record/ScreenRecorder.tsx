// "use client"
// import React, { useState } from 'react';
// import { createClient } from '@/utils/supabase/client';
// import { Session, Interview } from '@/app/types/database';
// import { usePathname, useRouter } from 'next/navigation';

// export default function ScreenRecorder({ sessionID, interviewID }: { sessionID: Session["id"], interviewID: Interview["id"] }) {
//     const supabase = createClient();
//     const path = usePathname();
//     const router = usePathname();
//     const [recording, setRecording] = useState(false);
//     const [mediaRecorder, setMediaRecorder] = useState<any>(null);
//     const [showSaveButton, setShowSaveButton] = useState(false);
//     const [recordedBlob, setRecordedBlob] = useState(null);

//     const startRecording = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
//             const recorder = new MediaRecorder(stream) as any;

//             recorder.ondataavailable = (e: any) => {
//                 setRecordedBlob(e.data);
//                 setShowSaveButton(true);
//             };

//             recorder.start();
//             setRecording(true);
//             setMediaRecorder(recorder);
//         } catch (error) {
//             console.error("Erreur lors du démarrage de l'enregistrement de l'écran", error);
//         }
//     };

//     const stopRecording = () => {
//         if (!mediaRecorder) return;
//         mediaRecorder.stop();
//         setRecording(false);
//     };

//     const saveRecording = async () => {
//         if (!recordedBlob) return;

//         // const file = new File([recordedBlob], 'screenRecording.webm', { type: recordedBlob.type });
//         const file = new File([recordedBlob], 'screenRecording.mp4', { type: 'video/mp4' });
//         // const { data, error } = await supabase.storage.from('interviews').upload(`interviews/${sessionID}/${interviewID}/raw/raw.webm`, file);
//         const { error } = await supabase.storage.from('interviews').upload(`/interviews/${sessionID}/${interviewID}/raw/raw.mp4`, file);

//         if (error) {
//             console.error("Erreur lors de l'upload de l'enregistrement", error);
//         } else {
//             console.log("Enregistrement sauvegardé avec succès:");
//             await supabase.from("interviews").update({ 'raw_file_ok': true }).filter('id', 'eq', interviewID);
//             // TODO: USE REAL CLOUD API URL 
//             try {
//                 fetch(`http://127.0.0.1:8000/predict`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         session_id: Number(sessionID),
//                         interview_id: Number(interviewID)
//                     })
//                 });
//             } catch (error) {
//                 console.error('error starting video processing', error)
//             }

//         }
//     };

//     return (
//         <div>
//             <div className='flex justify-center'>
//                 <button
//                     onClick={!recording ? startRecording : stopRecording}
//                     className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//                 >
//                     {!recording ? 'Start recording' : 'Stop recording'}
//                 </button>
//                 <p className="mx-2 text-white font-extrabold flex items-center h-full"> or</p>
//                 {showSaveButton && (
//                     <button
//                         onClick={saveRecording}
//                         className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//                     >
//                         Save Interview
//                     </button>
//                 )}
//             </div>


//         </div>
//     );
// }


"use client"
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Session, Interview } from '@/app/types/database';
import { usePathname, useRouter } from 'next/navigation';

export default function ScreenRecorder({ sessionID, interviewID }: { sessionID: Session["id"], interviewID: Interview["id"] }) {
    const supabase = createClient();
    const router = useRouter();
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<any>(null);
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const recorder = new MediaRecorder(stream) as any;

            recorder.ondataavailable = (e: any) => {
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

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setRecordedBlob(file);
            setShowSaveButton(true);
        }
    };

    const saveRecording = async () => {
        if (!recordedBlob) return;

        const file = new File([recordedBlob], 'screenRecording.mp4', { type: 'video/mp4' });
        const { error } = await supabase.storage.from('interviews').upload(`${sessionID}/${interviewID}/raw/raw.mp4`, file);

        if (error) {
            console.error("Erreur lors de l'upload de l'enregistrement", error);
        } else {
            console.log("Enregistrement sauvegardé avec succès:");
            await supabase.from("interviews").update({ 'raw_file_ok': true }).filter('id', 'eq', interviewID);
            try {
                fetch(`http://${process.env.NEXT_MIDDLEWARE_IP}/predict`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        session_id: Number(sessionID),
                        interview_id: Number(interviewID)
                    })
                });
                router.refresh();
            } catch (error) {
                console.error('error starting video processing', error)
            }
        }
    };

    return (
        <div>
            <div className='flex justify-center'>
                <button
                    onClick={!recording ? startRecording : stopRecording}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    {!recording ? 'Start recording' : 'Stop recording'}
                </button>
                <p className="mx-2 text-white font-extrabold flex items-center h-full"> or</p>
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="upload-video"
                />
                <label
                    htmlFor="upload-video"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                >
                    Upload Video
                </label>
                {showSaveButton && (
                    <button
                        onClick={saveRecording}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-4"
                    >
                        Save Interview
                    </button>
                )}
            </div>
        </div>
    );
}
