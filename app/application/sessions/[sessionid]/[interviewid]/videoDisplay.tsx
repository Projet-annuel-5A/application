"use client"

import { useEffect, useState, useRef } from "react";

export default function VideoDisplay({ videoUrl, results }: { videoUrl: string, results: any }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleResultClick = (start: number) => {
        if (videoRef.current) {
            // Conversion de millisecondes en secondes
            videoRef.current.currentTime = start / 1000;
            // videoRef.current.play();
        }
    };

    // Trier les résultats par 'start' de manière croissante
    const sortedResults = results.slice().sort((a: any, b: any) => a.start - b.start);

    return (
        <div className="flex w-full h-full justify-center space-x-2">
            <div className="h-full w-9/12">
                <video ref={videoRef} className="w-full object-cover" controls  style={{ height: '40vh' }}>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video.
                </video>
            </div>
            <div className="flex flex-col overflow-y-auto w-full" style={{ height: '40vh' }}>
                <div className='h-full w-full'>
                    {sortedResults.length > 0 ? (
                        <ul>
                            {sortedResults.map((result: any) => (
                                <div 
                                    key={result.start}
                                    className='flex w-full items-center justify-center space-x-2'
                                    onClick={() => handleResultClick(result.start)}
                                >
                                    <div className='w-full'>
                                        <div 
                                            className={`w-full rounded-lg shadow-md my-1 p-4 cursor-pointer hover:bg-gray-500 ${result.speaker === 0 ? "bg-slate-400" : 'bg-slate-200'}`}
                                        >
                                            <p className="font-semibold">{result.start / 1000} : {result.end / 1000}</p>
                                            <p>{result.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </ul>
                    ) : (
                        <div>No results found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
