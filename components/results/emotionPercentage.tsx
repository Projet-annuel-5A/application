

interface EmotionsInterface {
    [key: string]: number
}

export default function EmotionPercentageBox({ modality, emotionResults }: { modality: string, emotionResults: EmotionsInterface }) {

    const topThreeEmotions = Object.entries(emotionResults).sort(([, a], [, b]) => b - a).slice(0, 3);

    return (
        <div className="flex flex-col mx-3 justify-center items-center w-full">
            <span className="text-white">{modality} Analysis</span>
            {topThreeEmotions.map((emotionScore) => (
                Math.round(emotionScore[1]) > 0 && (
                    <div key={emotionScore[0]} className="flex justify-center p-2 bg-slate-500 rounded-md my-2 shadow-md w-3/5">
                        <span className="text-white">{emotionScore[0]} : </span>
                        <span className="text-white font-bold mx-2">{Math.round(emotionScore[1])} %</span>
                    </div>
                )
            ))}
        </div>
    )
    
}