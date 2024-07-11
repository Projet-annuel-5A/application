"use client"
import { supabaseBrowserClient as supabase, getUserClient } from '@/utils/supabase/client';
import { sendAgreementRequest } from '@/functions/agreement';
import { Session, Interview } from '@/app/types/database';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import React from 'react';

interface ParamsInterface {
    sessionid: Session["id"]
}


export default function Page({ params }: { params: ParamsInterface }) {

    const [ isSending, setIsSending ] = useState<boolean>(false)

    const router = useRouter();
    const [interviewData, setInterviewData] = useState<Interview>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        duration: 0,
        session_id: params.sessionid,
        user_id: '',
        agreement_ok: false,
        agreement_doc_id:'',
        raw_file_ok: false,
        diarization_ok: false,
        audio_ok: false,
        video_ok: false,
        text_ok: false,
        inference_ok: false,
        speaker_validation_ok: false
        
    });


    const isFormValid = () => {
        const phoneRegex = /^\+33\d{9}$/;
        return interviewData.first_name.length > 2 &&
            interviewData.last_name.length > 2 &&
            interviewData.email.includes("@") &&
            interviewData.email.length > 3 &&
            phoneRegex.test(interviewData.phone);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInterviewData({ ...interviewData, [name]: value });
    };

    const addInterview = async (interview: Interview) => {
        const { data, error } = await supabase.from('interviews').insert([interview]);

        if (error) {
            console.error('Error adding session:', error.message);
            setIsSending(false);
        } else {
            router.push(`/application/sessions/${params.sessionid}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setIsSending(true);
        e.preventDefault();
        const user_id = (await getUserClient()).data.user?.id;
        const updatedInterviewData = { ...interviewData, user_id: user_id || '' };

        await addInterview(updatedInterviewData);

        await sendAgreementRequest({
            candidateLastName: updatedInterviewData.last_name,
            candidateFirstName: updatedInterviewData.first_name,
            candidateEmail: updatedInterviewData.email,
            candidatePhone: updatedInterviewData.phone
        });

        setIsSending(false);

    };

    return (
        <div className='flex justify-center items-center min-h-screen w-3/4'>
            <div className='w-full max-w-lg bg-white p-8 rounded-lg shadow-lg'>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add new interview</h1>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            First name:
                            <input
                                type="text"
                                name="first_name"
                                value={interviewData.first_name}
                                onChange={handleInputChange}
                                placeholder="Enter first name"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Last name:
                            <input
                                type="text"
                                name="last_name"
                                value={interviewData.last_name}
                                onChange={handleInputChange}
                                placeholder="Enter last name"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Candidate email address:
                            <input
                                type="email"
                                name="email"
                                value={interviewData.email}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Candidate phone number:
                            <input
                                type="tel"
                                name="phone"
                                value={interviewData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter phone number (e.g., +33123456789)"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                            />
                        </label>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => router.push('/application/sessions')}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`font-bold py-2 px-4 rounded-md ${isFormValid() && !isSending ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            disabled={!isFormValid() || isSending}
                        >
                            {isSending ? 'Creating ...' : 'Create Interview'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}