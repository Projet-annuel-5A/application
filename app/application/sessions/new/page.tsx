"use client"

import React, { useState } from "react";
import { Session } from "@/app/types/database";
import { getUserClient } from "@/utils/supabase/client";
import { supabaseBrowserClient as supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";



export default function Page() {
    const router = useRouter();

    const [sessionData, setSessionData] = useState<Session>({
        name: '',
        startDate: '',
        endDate: '',
    });

    const addSession = async (session: Session) => {
        const { data, error } = await supabase.from('sessions').insert([session]);
        if (error) {
            console.error('Error adding session:', error.message);
        } else {
            router.push('/application/sessions');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSessionData({ ...sessionData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const userID = (await getUserClient()).data.user?.id;
        await addSession({ ...sessionData, user_id: userID });
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h1 className="text-xl font-semibold text-gray-800 mb-6">Add a new interview session</h1>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={sessionData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Start Date:
                            <input
                                type="date"
                                name="startDate"
                                value={sessionData.startDate}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            End Date:
                            <input
                                type="date"
                                name="endDate"
                                value={sessionData.endDate}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                        >
                            Save Session
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}