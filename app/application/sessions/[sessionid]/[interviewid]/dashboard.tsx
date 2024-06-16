"use client"

import { useEffect, useState, useRef } from "react";
import { calculateAverageEmotions } from "@/functions/compute";
import { textCompatibilityObj, getEmotionCompatibilityObj } from '@/utils/emotions/emotionCompatibility';
import EmotionPercentageBox from '@/components/results/emotionBox';

export default function Dashboard({ videoUrl, results }: { videoUrl: string, results: any }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [sortedResults, setSortedResults] = useState<any[]>([]);
    const [audio, setAudio] = useState<any[]>([]);
    const [text, setText] = useState<any[]>([]);
    const [video, setVideo] = useState<any[]>([]);
    

    const handleResultClick = (start: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = start / 1000;
            const idx = sortedResults.findIndex(result => start >= result.start && start <= result.end);
            if (idx !== -1) {
                setCurrentIdx(idx);
            }
        }
    };

    useEffect(() => {
        const handleTimeUpdate = () => {
            if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime * 1000); // Convert to milliseconds
            }
        };

        if (videoRef.current) {
            videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };
    }, []);

    useEffect(() => {
        const sorted = results.slice().sort((a: any, b: any) => a.start - b.start);
        setSortedResults(sorted);

        const audioEmotions = sorted.map((result: any) => result.audio_emotions);
        setAudio(audioEmotions);

        const textEmotions = sorted.map((result: any) => result.text_emotions);
        setText(textEmotions);

        const videoEmotions = calculateAverageEmotions(sorted);
        setVideo(videoEmotions);

        // console.log("compatibility", compatibility);
        // console.log("sorted", sorted);
        // console.log("text", textEmotions);
        // console.log("video", videoEmotions);
        // console.log("audio", audioEmotions);

    }, [results]);

    useEffect(() => {
        if (sortedResults.length > 0) {
            const idx = sortedResults.findIndex(result => currentTime >= result.start && currentTime <= result.end);
            if (idx !== -1) {
                setCurrentIdx(idx);
            }
        }
    }, [currentTime, sortedResults]);

    return (
        <div className="flex flex-col w-full h-full">
            {/* VIDEO DISPLAY */}
            <div className="flex w-full h-full justify-center space-x-2">
                <div className="h-full w-9/12">
                    <video ref={videoRef} className="w-full object-cover" controls style={{ height: '40vh' }}>
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
                                                className={`w-full rounded-lg shadow-md my-1 p-4 cursor-pointer hover:bg-gray-800 hover:text-white ${Math.floor(currentTime) >= Math.floor(result.start) && Math.floor(currentTime) <= Math.floor(result.end) ? "border-4 border-blue-500" : ""} ${result.speaker === 0 ? "bg-slate-400" : 'bg-slate-200'}`}
                                            >
                                                {result.text}
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


            {/* RESULTS DISPLAY */}
            <div className="flex flex-col my-5">
                
                {video && text && audio && video[currentIdx] && text[currentIdx] && audio[currentIdx] && (
                    <EmotionPercentageBox videoResults={video[currentIdx]} textResults={text[currentIdx]} audioResults={audio[currentIdx]} />
                )}

            </div>
        </div>
    );
}
