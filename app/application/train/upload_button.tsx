// "use client";


// import React, { useRef, useState } from 'react';
// import axios from 'axios';

// export default function FileUploadButton({ folderName }: { folderName: string }) {
//     const fileInputRef = useRef<HTMLInputElement | null>(null);
//     const [uploadStatus, setUploadStatus] = useState('');

//     const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//         const files = event.target.files;
//         if (files) {
//             const formData = new FormData();
//             for (let i = 0; i < files.length; i++) {
//                 const file = files[i];
//                 if (file.type === 'image/jpeg') {
//                     formData.append('files', file);
//                 } else {
//                     alert('Please upload JPG files only');
//                     return;
//                 }
//             }
//             formData.append('folderName', folderName);

//             try {
//                 const response = await axios.post('/api/upload', formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 });
//                 setUploadStatus('Files uploaded successfully');
//                 console.log('Files uploaded successfully:', response.data);
//             } catch (error) {
//                 setUploadStatus('Upload failed');
//                 console.error('Upload failed:', error);
//             }
//         }
//     };

//     const openFileDialog = () => {
//         fileInputRef.current?.click();
//     };

//     return (
//         <div className="flex justify-center gap-x-5 bg-slate-300 w-2/5 p-5 rounded-lg">
//             <div className='w-full flex flex-col gap-y-3'>
//                 <span className='text-center font-bold'>Add {folderName} data</span>
//                 <button
//                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                     onClick={openFileDialog}
//                 >
//                     select file
//                 </button>
//                 <input
//                     type="file"
//                     accept="image/jpeg"
//                     multiple
//                     ref={fileInputRef}
//                     style={{ display: 'none' }}
//                     onChange={handleFileUpload}
//                 />
//                 {uploadStatus && (
//                     <p className={`mt-4 text-sm ${uploadStatus.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
//                         {uploadStatus}
//                     </p>
//                 )}
//             </div>


//         </div>
//     );
// };



"use client";

import React, { useRef, useState } from 'react';
import axios from 'axios';

export default function FileUploadButton({ folderName }: { folderName: string }) {
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
        <div className="flex justify-center bg-slate-100 w-full md:w-2/5 p-5 rounded-lg shadow-lg">
            <div className='w-full flex flex-col items-center gap-y-4'>
                <span className='text-center font-bold text-lg text-gray-700'>Add {folderName} data</span>
                <button
                    className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={openFileDialog}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Select Files
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
        </div >
    );
}