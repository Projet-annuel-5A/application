"use client"

import { useState } from 'react';
import { createClient } from "@/utils/supabase/client"
import Modal from '@/components/windows/modal';

export default function AddSession({ addSession }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sessionData, setSessionData] = useState({
        name: '',
        startDate: '',
        endDate: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSessionData({ ...sessionData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addSession(sessionData);
        setSessionData({ name: '', startDate: '', endDate: '' });
        closeModal
    };



    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={openModal}>Add Session</button>
            <Modal isOpen={isModalOpen} close={closeModal}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Name:
                            <input type="text" name="name" value={sessionData.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Start Date:
                            <input type="date" name="startDate" value={sessionData.startDate} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            End Date:
                            <input type="date" name="endDate" value={sessionData.endDate} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </label>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={closeModal} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Session</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
