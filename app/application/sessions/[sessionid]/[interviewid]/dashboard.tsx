"use client"

import { useEffect, useState, useRef } from "react";
import { calculateAverageEmotions, get3MostEmotions } from "@/functions/compute";
import EmotionPercentageBox from '@/components/results/emotionBox';
import { AreaChart, Area, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { updateSpeakerInDB } from "@/utils/supabase/browserQueries";
import { usePathname, useRouter } from 'next/navigation'


export default function Dashboard({ videoUrl, results, complet, sessionID, interviewID }: { videoUrl: string, results: any, complet: boolean, sessionID: string | undefined, interviewID: string | undefined }) {

    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [sortedResults, setSortedResults] = useState<any[]>([]);
    const [audio, setAudio] = useState<any[]>([]);
    const [filteredAudio, setFilteredAudio] = useState<any[]>([]);
    const [text, setText] = useState<any[]>([]);
    const [filteredText, setFilteredText] = useState<any[]>([]);
    const [video, setVideo] = useState<any[]>([]);
    const [filteredVideo, setFilteredVideo] = useState<any[]>([]);
    const [speaker, setSpeaker] = useState<number>(0);
    const [speakerStartTS, setSpeakerStartTS] = useState<number[]>([]);
    const [textEmotionChartFilter, setTextEmotionChartFilter] = useState<string[]>([]);
    const [videoEmotionChartFilter, setVideoEmotionChartFilter] = useState<string[]>([]);
    const [audioEmotionChartFilter, setAudioEmotionChartFilter] = useState<string[]>([]);
    const [selectedChartModality, setSelectedChartModality] = useState<string>("video");
    const [isSaving, setIsSaving] = useState(false);
    const [modeltype, setModelType] = useState<string>("deepface");

    const router = useRouter();
    const pathName = usePathname();

    const handleResultClick = (start: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = start / 1000;
            const idx = sortedResults.findIndex(result => start >= result.start && start <= result.end);
            if (idx !== -1) {
                setCurrentIdx(idx);
            }
        }
    };

    const handleSpeakerValidation = () => {

        setIsSaving(true);
        updateSpeakerInDB(sortedResults, interviewID);

        try {
            if (process.env.NEXT_PUBLIC_ENV === 'production') {
                var url = `https://${process.env.NEXT_PUBLIC_MIDDLEWARE_IP}/predict`;
            } else {
                var url = `http://${process.env.NEXT_PUBLIC_MIDDLEWARE_IP}:8000/predict`;
            }
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_id: Number(sessionID),
                    interview_id: Number(interviewID),
                    model: modeltype
                })
            });
            router.push(pathName.split("/").slice(0, -1).join("/"));
        } catch (error) {
            console.error('error starting video processing', error)
        }

        router.push(pathName.split("/").slice(0, -1).join("/"));

        setIsSaving(false);
    }

    const handleSwitchAllSpeaker = () => {
        setSortedResults(prevResults => {
            return prevResults.map(result => {
                return { ...result, speaker: result.speaker === 0 ? 1 : 0 };
            });
        });
    };

    const handleSwitchSpeaker = (start: number) => {
        setSortedResults(prevResults => {
            return prevResults.map(result => {
                if (result.start === start) {
                    return { ...result, speaker: result.speaker === 0 ? 1 : 0 };
                }
                return result;
            });
        });
    };

    const handleChartModalitySelection = (modality: string) => {
        setSelectedChartModality(modality);
    }

    const handleSwitchModelType = () => {
        if (modeltype === "deepface") {
            setModelType("yolo")
        } else if (modeltype === "yolo") {
            setModelType("deepface")
        } else {
            console.error("Unknown model type")
        }
    }

    useEffect(() => {
        const handleTimeUpdate = () => {
            if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime * 1000);
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
        const filteredResults = sorted.filter((result: any) => result.speaker === 0);
        setSpeakerStartTS(filteredResults.map((result: any) => result.start));

        if (complet) {

            const audioEmotions = sorted.map((result: any) => result.audio_emotions);
            const filteredAudioEmotions = filteredResults.map((result: any) => result.audio_emotions);
            setAudio(audioEmotions);
            setFilteredAudio(filteredAudioEmotions);

            const textEmotions = sorted.map((result: any) => result.text_emotions);
            const filteredTextEmotions = filteredResults.map((result: any) => result.text_emotions);
            setText(textEmotions);
            setFilteredText(filteredTextEmotions);

            const videoEmotions = calculateAverageEmotions(sorted);
            const filteredVideoEmotions = calculateAverageEmotions(filteredResults);
            setVideo(videoEmotions);
            setFilteredVideo(filteredVideoEmotions);


            setVideoEmotionChartFilter(get3MostEmotions(filteredVideoEmotions));
            setAudioEmotionChartFilter(get3MostEmotions(filteredAudioEmotions));
            setTextEmotionChartFilter(get3MostEmotions(filteredTextEmotions));
        }

    }, [results, speaker]);


    useEffect(() => {
        if (sortedResults.length > 0) {
            const idx = sortedResults.findIndex(result => currentTime >= result.start && currentTime <= result.end);
            if (idx !== -1) {
                setCurrentIdx(idx);
            }
        }
    }, [currentTime, sortedResults]);

    const getSelectedData = () => {
        switch (selectedChartModality) {
            case "audio":
                return filteredAudio;
            case "text":
                return filteredText;
            default:
                return filteredVideo;
        }
    };

    const getTop3Emotion = () => {
        switch (selectedChartModality) {
            case "audio":
                return audioEmotionChartFilter;
            case "text":
                return textEmotionChartFilter;
            default:
                return videoEmotionChartFilter;
        }
    }

    return (
        <div className="flex flex-col w-full h-full">
            {!complet ?
                <div className="flex w-full justify-between">
                    <button
                        className={`mb-4 px-4 py-2 bg-green-700 text-white rounded ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'} active:bg-green-900 w-1/6`}
                        onClick={handleSpeakerValidation}
                        disabled={isSaving}
                    >
                        Validate speakers
                    </button>
                    <button
                        className={`mb-4 px-4 py-2 bg-gray-700 text-white rounded ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'} active:bg-gray-900 w-1/6`}
                        onClick={handleSwitchModelType}
                    >
                        Video model : {modeltype}
                    </button>
                    <button
                        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-1/6"
                        onClick={handleSwitchAllSpeaker}
                    >
                        Switch all speackers
                    </button>
                    <button
                        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-1/6"
                        onClick={() => router.push(`application/sessions/${sessionID}/${interviewID}/infos`)}
                    >
                        Candidate informations
                    </button>
                </div> : null
            }

            {/* VIDEO DISPLAY */}
            <div className="flex w-full h-full justify-center space-x-2">
                <div className="h-full w-9/12">
                    <video ref={videoRef} className="w-full object-cover" controls style={{ height: '40vh' }}>
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video.
                    </video>
                </div>
                {/* TEXT DISPLAY */}
                <div className="flex flex-col overflow-y-auto w-full" style={{ height: '40vh' }}>
                    <div className='h-full w-full'>
                        {sortedResults.length > 0 ? (
                            <ul>
                                {sortedResults.map((result: any) => (
                                    <div className="w-full flex">
                                        <div
                                            key={result.start}
                                            className='flex w-full items-center justify-center space-x-2'
                                            onClick={() => handleResultClick(result.start)}
                                        >
                                            <div className='w-full'>
                                                <div
                                                    className={`w-full rounded-lg shadow-md my-1 p-4 cursor-pointer hover:bg-gray-800 hover:text-white ${Math.floor(currentTime) >= Math.floor(result.start) && Math.floor(currentTime) <= Math.floor(result.end) ? "border-4 border-blue-500" : ""} ${result.speaker === 0 ? "bg-slate-400" : 'bg-slate-200'}`}
                                                >
                                                    <span className="font-semibold">{result.speaker === 0 ? "Candidate" : "Interviewer"}:</span> <span>{result.text}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {!complet ?
                                            <button className="bg-blue-500 p-2 rounded shadow-md m-2 cursor-pointer" onClick={() => handleSwitchSpeaker(result.start)}>
                                                Switch
                                            </button> : null
                                        }

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
            {complet ?
                <div className="flex flex-col my-5 w-full h-full">
                    {/* EMOTION BOX */}
                    <div className="flex flex-col my-5">
                        {video[currentIdx] && text[currentIdx] && audio[currentIdx] && sortedResults[currentIdx].speaker === 0 ? (
                            <EmotionPercentageBox videoResults={video[currentIdx]} textResults={text[currentIdx]} audioResults={audio[currentIdx]} />
                        ) : (
                            <div className="flex justify-center w-full my-3 p-2 rounded-md shadow-md bg-slate-400">
                                <p>The candidate is not currently talking</p>
                            </div>
                        )}
                    </div>

                    {/* CHART */}
                    <div className="flex flex-col w-full h-full">
                        {/* CHART MODALITY SELECTION */}
                        <div className="flex space-x-4">

                            {["video", "audio", "text"].map(modality => (
                                <button
                                    key={modality}
                                    className={`px-4 py-2 rounded ${selectedChartModality === modality ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} hover:bg-blue-700`}
                                    onClick={() => handleChartModalitySelection(modality)}
                                >
                                    {modality}
                                </button>
                            ))}
                        </div>
                        <div className="w-full h-full my-3 bg-slate-400 rounded-md shadow-md py-3">
                            <ResponsiveContainer width="100%" height={400}>
                                <AreaChart
                                    width={500}
                                    height={400}
                                    data={getSelectedData()}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                    onClick={(event) => {
                                        if (event && event.activePayload && event.activePayload.length > 0) {
                                            const clickedData = event.activePayload[0].payload;
                                            // handleChartClick(clickedData, event.activeTooltipIndex);
                                            if (event.activeTooltipIndex) {
                                                // setCurrentTime(speakerStartTS[event.activeTooltipIndex])
                                                handleResultClick(speakerStartTS[event.activeTooltipIndex])
                                            }

                                        }
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey={getTop3Emotion()[0]} stackId="1" stroke="#8884d8" fill="#8884d8" />
                                    <Area type="monotone" dataKey={getTop3Emotion()[1]} stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                                    <Area type="monotone" dataKey={getTop3Emotion()[2]} stackId="1" stroke="#ffc658" fill="#ffc658" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div> : null}
        </div>
    );
}

interface CustomTooltipProps {
    payload?: any;
    label?: any;
    active?: boolean;
}

const CustomTooltip = ({ payload, label, active }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        const sortedPayload = payload.sort((a: any, b: any) => b.value - a.value);

        return (
            <div className="custom-tooltip bg-white rounded p-4 shadow-md">
                <p className="label">{`${label}`}</p>
                {sortedPayload.map((entry: any, index: any) => (
                    <p key={index} style={{ color: entry.color }}>{`${entry.name}: ${entry.value.toFixed(0)} %`}</p>
                ))}
            </div>
        );
    }

    return null;
};
