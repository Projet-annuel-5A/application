import { Interview } from '@/app/types/database'

export const countTrueValues = (interview: Interview) => {
    let count = 0;
    if (interview.video_ok) count++;
    if (interview.text_ok) count++;
    if (interview.audio_ok) count++;
    if (interview.diarization_ok) count++;
    return count;
};


export function calculateAverageEmotions(data) {
    return data.map(item => {
        const videoEmotions = item.video_emotions;
        const emotionSums = {};
        let frameCount = 0;

        Object.entries(videoEmotions).forEach(([frame, emotions]) => {
            if (!emotions['No face detected']) {
                frameCount++;
                Object.entries(emotions).forEach(([emotion, value]) => {
                    if (!emotionSums[emotion]) {
                        emotionSums[emotion] = 0;
                    }
                    emotionSums[emotion] += value;
                });
            }
        });

        const averageEmotions = {};
        Object.entries(emotionSums).forEach(([emotion, sum]) => {
            averageEmotions[emotion] = sum / frameCount;
        });

        return averageEmotions;
    });
}