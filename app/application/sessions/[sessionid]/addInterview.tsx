"use client"

import { useState } from 'react';
import Modal from '@/components/windows/modal';

export default function AddInterview({ addInterview , sessionid }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [interviewData, setinterviewData] = useState({
        firstName: '',
        lastName:'',
        sessionId:''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setinterviewData({ ...interviewData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        interviewData.sessionId = sessionid;

        await addInterview(interviewData);
        setinterviewData({ firstName: '', lastName: '', sessionId: '' });
        closeModal
    };



    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={openModal}>Add Interview</button>
            <Modal isOpen={isModalOpen} close={closeModal}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            First Name:
                            <input type="text" name="firstName" value={interviewData.firstName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Last Name:
                            <input type="text" name="lastName" value={interviewData.lastName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </label>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={closeModal} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Interview</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
