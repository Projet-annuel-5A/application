import { useEffect, useState } from "react";
import { textCompatibilityObj, getEmotionCompatibilityObj } from '@/utils/emotions/emotionCompatibility';
import { computeInconsistency } from '@/functions/compute';
import { Compatibility } from '@/utils/emotions/emotionCompatibility';

interface EmotionsInterface {
    [key: string]: number;
}

export default function EmotionPercentageBox({
    videoResults,
    textResults,
    audioResults,
}: {
    videoResults: EmotionsInterface,
    textResults: EmotionsInterface,
    audioResults: EmotionsInterface
}) {

    const [topThreeVideoEmotions, setTopThreeVideoEmotions] = useState<[string, number][]>([]);
    const [topThreetextEmotions, setTopThreetextEmotions] = useState<[string, number][]>([]);
    const [topThreeAudioEmotions, setTopThreeAudioEmotions] = useState<[string, number][]>([]);

    const [emotionCompatibility, setEmotionCompatibility] = useState<Compatibility | null>(null);
    const [inconsistencyScore, setInconsistencyScore] = useState<number>(0);

    useEffect(() => {

        const topThreeVideo = Object.entries(videoResults).sort(([, a], [, b]) => b - a).slice(0, 3);
        setTopThreeVideoEmotions(topThreeVideo);

        const topThreeText = Object.entries(textResults).sort(([, a], [, b]) => b - a).slice(0, 3);
        setTopThreetextEmotions(topThreeText);

        const topThreeAudio = Object.entries(audioResults).sort(([, a], [, b]) => b - a).slice(0, 3);
        setTopThreeAudioEmotions(topThreeAudio);

        const inconsistency = computeInconsistency({
            textEmotion: topThreeText[0][0],
            videoEmotion: topThreeVideo[0][0],
            audioEmotion: topThreeAudio[0][0],
            compatibility: emotionCompatibility
        });
        setInconsistencyScore(inconsistency);

    }, [videoResults, textResults, audioResults]);

    useEffect(() => {
        const compatibility = getEmotionCompatibilityObj(textCompatibilityObj);
        setEmotionCompatibility(compatibility);

    }, [textCompatibilityObj])

    return (
        <div className="flex flex-col w-full h-full">
            <div className={`flex justify-center w-full my-3 p-2 rounded-md ${inconsistencyScore === 3 ? 'bg-red-500' : ''} ${inconsistencyScore === 2 ? 'bg-yellow-500' : ''} ${inconsistencyScore === 1 || inconsistencyScore === 0 ? 'bg-green-500' : ''}`}>
                {inconsistencyScore === 3 ? (
                    <span className="font-bold">High inconsistency</span>
                ) : (
                    inconsistencyScore === 2 ? (
                        <span className="font-bold">Moderate inconsistency</span>
                    ) : (
                        inconsistencyScore === 1 || inconsistencyScore === 0 ? (
                            <span className="font-bold">Low inconsistency</span>
                        ) : <span className="font-bold">Consitent</span>
                    )
                )}
            </div>

            <div className={`flex justify-center bg-slate-400 rounded p-2 shadow-md border-2 ${inconsistencyScore === 3 ? 'border-red-500' : ''} ${inconsistencyScore === 2 ? 'border-yellow-500' : ''} ${inconsistencyScore === 1 || inconsistencyScore === 0 ? 'border-green-500' : ''}`}>

                {/* VIDEO */}
                <div className="flex flex-col mx-3 items-center w-full">

                    <span className="text-white">Video Analysis</span>

                    {topThreeVideoEmotions.map((emotionScore, idx) => (
                        Math.round(emotionScore[1]) > 0 && (
                            <div key={emotionScore[0]} className="flex justify-center p-2 bg-slate-500 rounded-md my-2 shadow-md w-3/5">
                                <span className="text-white">{idx + 1}: {emotionScore[0]} </span>
                            </div>
                        )
                    ))}
                </div>

                {/* TEXT */}
                <div className="flex flex-col mx-3 items-center w-full">

                    <span className="text-white">Text Analysis</span>

                    {topThreetextEmotions.map((emotionScore, idx) => (
                        Math.round(emotionScore[1]) > 0 && (
                            <div key={emotionScore[0]} className="flex justify-center p-2 bg-slate-500 rounded-md my-2 shadow-md w-3/5">
                                <span className="text-white">{idx + 1}: {emotionScore[0]} </span>
                            </div>
                        )
                    ))}
                </div>

                {/* AUDIO */}
                <div className="flex flex-col mx-3 items-center w-full">

                    <span className="text-white">Audio Analysis</span>

                    {topThreeAudioEmotions.map((emotionScore, idx) => (
                        Math.round(emotionScore[1]) > 0 && (
                            <div key={emotionScore[0]} className="flex justify-center p-2 bg-slate-500 rounded-md my-2 shadow-md w-3/5">
                                <span className="text-white">{idx + 1}: {emotionScore[0]} </span>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>

    )
}



