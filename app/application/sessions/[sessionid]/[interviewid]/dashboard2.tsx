"use client"

import { useEffect, useState } from "react";
import { fetchInterviewResult } from "@/utils/supabase/browserQueries";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { calculateAverageEmotions } from "@/functions/compute";
import { textCompatibilityObj, getEmotionCompatibilityObj } from '@/utils/emotions/emotionCompatibility';

export default function Dashboard({ results }: { results: any }) {

    const sortedResults = results.slice().sort((a: any, b: any) => a.start - b.start);
    const audio = sortedResults.map((result: any) => result.audio_emotions);
    const text = sortedResults.map((result: any) => result.text_emotions);
    const video = calculateAverageEmotions(sortedResults);
    const emotionCompatibility = getEmotionCompatibilityObj(textCompatibilityObj)

    console.log("compatibility",emotionCompatibility);
    console.log("text",text)
    console.log("video", video);
    console.log("audio", audio);

    return (
        <div className="flex justify-center w-full my-5" style={{height: '50vh'}}>
            
        </div>
    );
}
