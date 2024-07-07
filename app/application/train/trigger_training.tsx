"use client";
import React, { useState } from 'react';
import axios from 'axios';

export default function TriggerTrainning() {
    const [status, setStatus] = useState('');

    const handleTrainJob = async () => {
        setStatus('Creating training job...');
        try {
            const response = await axios.post('/api/train');
            setStatus(`Success: ${response.data.message}`);
        } catch (error: any) {
            setStatus(`Error: ${error.response?.data.message || 'Failed to create training job'}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <button
                onClick={handleTrainJob}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Create Training Job
            </button>
            {status && (
                <p className="mt-4 text-lg">
                    {status.includes('Success') ? (
                        <span className="text-green-500">{status}</span>
                    ) : (
                        <span className="text-red-500">{status}</span>
                    )}
                </p>
            )}
        </div>
    );
}
