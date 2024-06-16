import { Interview } from '@/app/types/database'
import { Compatibility } from '@/utils/emotions/emotionCompatibility';
export const countTrueValues = (interview: Interview) => {
    let count = 0;
    if (interview.video_ok) count++;
    if (interview.text_ok) count++;
    if (interview.audio_ok) count++;
    if (interview.diarization_ok) count++;
    return count;
};


export function calculateAverageEmotions(data: any) {
    return data.map((item: any) => {
        const videoEmotions = item.video_emotions;
        const emotionSums : {[key: string]: number} = {};
        let frameCount = 0;

        Object.entries(videoEmotions).forEach(([frame, emotions]:[any,any]) => {
            if (!emotions['No face detected']) {
                frameCount++;
                Object.entries(emotions).forEach(([emotion, value]:[any,any]) => {
                    if (!emotionSums[emotion]) {
                        emotionSums[emotion] = 0;
                    }
                    emotionSums[emotion] += value;
                });
            }
        });

        const averageEmotions: {[key: string]: number} = {};
        Object.entries(emotionSums).forEach(([emotion, sum]) => {
            averageEmotions[emotion] = sum / frameCount;
        });

        return averageEmotions;
    });
}

export function computeInconsistency({
    textEmotion,
    videoEmotion,
    audioEmotion,
    compatibility
}:{
    textEmotion: string,
    videoEmotion: string,
    audioEmotion: string,
    compatibility: Compatibility | null
}): number {

    let inconsistency = 0;

    if (compatibility){
        
        const textCompatibilities = compatibility.text[textEmotion];
        const videoCompatibilities = compatibility.video[videoEmotion];
        const audioCompatibilities = compatibility.audio[audioEmotion];

        if (!videoCompatibilities.text.includes(textEmotion)){ // Check text compatibility over video
            inconsistency += 1;
        }

        if (!audioCompatibilities.text.includes(textEmotion)){ // Check text compatibility over audio
            inconsistency += 1;
        }

        if (!videoCompatibilities.text.includes(audioEmotion)){ // Check video compatibility over audio
            inconsistency += 1;
        }

        // console.log("compatibility",compatibility);
        console.log("inconsistency", inconsistency);
    }


    return inconsistency;
}