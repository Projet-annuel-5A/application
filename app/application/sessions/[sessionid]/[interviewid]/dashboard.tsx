"use client"

import { useEffect, useState } from "react";
import { fetchInterviewResult } from "@/utils/supabase/browserQueries";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { calculateAverageEmotions } from "@/functions/compute";

export default function Dashboard({ results }: { results: any }) {

    const sortedResults = results.slice().sort((a: any, b: any) => a.start - b.start);
    const audio = sortedResults.map((result: any) => result.audio_emotions);
    const text = sortedResults.map((result: any) => result.text_emotions);
    const video = calculateAverageEmotions(sortedResults);
    console.log(sortedResults)

    return (
        <div className="flex justify-center w-full my-5" style={{height: '50vh'}}>
            <LineChart width={350} height={350} data={audio}>
                <Line type="monotone" dataKey="Sad" stroke="#8884d8" dot={false}/>
                <Line type="monotone" dataKey="Neutral" stroke="#96959c" dot={false}/>
                <Line type="monotone" dataKey="Pleased" stroke="#6fb569" dot={false}/>
                <YAxis />
                <Tooltip />
                <Legend />
            </LineChart>
            <LineChart width={350} height={350} data={text}>
                <Line type="monotone" dataKey="sadness" stroke="#8884d8" dot={false}/>
                {/* <Line type="monotone" dataKey="calmness" stroke="#96959c" dot={false}/> */}
                <Line type="monotone" dataKey="joy" stroke="#6fb569" dot={false}/>
                <YAxis />
                <Tooltip />
                <Legend />
            </LineChart>
            <LineChart width={350} height={350} data={video}>
                <Line type="monotone" dataKey="sad" stroke="#8884d8" dot={false}/>
                {/* <Line type="monotone" dataKey="neutral" stroke="#96959c" dot={false}/> */}
                <Line type="monotone" dataKey="happy" stroke="#6fb569" dot={false}/>
                <YAxis />
                <Tooltip />
                <Legend />
            </LineChart>
        </div>
    );
}
