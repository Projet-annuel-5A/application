"use client";


import React, { useRef, useState } from 'react';
import axios from 'axios';

export default function FileUploadButton ({ folderName }: { folderName: string }) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type === 'image/jpeg') {
                    formData.append('files', file);
                } else {
                    alert('Please upload JPG files only');
                    return;
                }
            }
            formData.append('folderName', folderName);

            try {
                const response = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setUploadStatus('Files uploaded successfully');
                console.log('Files uploaded successfully:', response.data);
            } catch (error) {
                setUploadStatus('Upload failed');
                console.error('Upload failed:', error);
            }
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex justify-start gap-x-5">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={openFileDialog}
            >
                Upload to {folderName}
            </button>
            <input
                type="file"
                accept="image/jpeg"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
            />
            {uploadStatus && (
                <p className={`mt-4 text-sm ${uploadStatus.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                    {uploadStatus}
                </p>
            )}
        </div>
    );
};
