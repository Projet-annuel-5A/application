export const textCompatibilityObj = {
    "text": {
        "anger": {
            "video": ["angry"],
            "audio": ["Tension"]
        },
        "annoyance": {
            "video": ["angry"],
            "audio": ["Tension"]
        },
        "disapproval": {
            "video": ["angry"],
            "audio": ["Tension"]
        },
        "envy": {
            "video": ["angry"],
            "audio": ["Tension"]
        },
        "frustration": {
            "video": ["angry"],
            "audio": ["Tension"]
        },
        "disgust": {
            "video": ["disgust"],
            "audio": ["Tension"]
        },
        "pain": {
            "video": ["disgust"],
            "audio": ["Tension"]
        },
        "doubt": {
            "video": ["fear"],
            "audio": ["Tension"]
        },
        "embarrassment": {
            "video": ["fear"],
            "audio": ["Tension"]
        },
        "fear": {
            "video": ["fear"],
            "audio": ["Tension"]
        },
        "nervousness": {
            "video": ["fear"],
            "audio": ["Tension"]
        },
        "admiration": {
            "video": ["happy"],
            "audio": ["Pleased"]
        },
        "amusement": {
            "video": ["happy"],
            "audio": ["Pleased"]
        },
        "approval": {
            "video": ["happy"],
            "audio": ["Pleased"]
        },
        "caring": {
            "video": ["happy"],
            "audio": ["Pleased"]
        },
        "courage": {
            "video": ["happy"],
            "audio": ["Pleased"]
        },
        "desire": {
            "video": ["happy"],
            "audio": ["Pleased"]
        },
        "faith": {
            "video": ["happy"],
            "audio": ["Pleased"]
        },
        "gratitude": {
            "video": ["happy"],
            "audio": ["Pleased"]
        },
        "joy": {
            "video": ["happy"],
            "audio": ["Pleased"]
        },
        "love": {
            "video": ["happy"],
            "audio": ["Pleased"]
        },
        "optimism": {
            "video": ["happy"],
            "audio": ["Pleased"]
        },
        "pride": {
            "video": ["happy"],
            "audio": ["Pleased"]
        },
        "relief": {
            "video": ["happy"],
            "audio": ["Pleased"]
        },
        "boredom": {
            "video": ["neutral"],
            "audio": ["Neutral", "Relaxed"]
        },
        "calmness": {
            "video": ["neutral"],
            "audio": ["Neutral", "Relaxed"]
        },
        "indifference": {
            "video": ["neutral"],
            "audio": ["Neutral", "Relaxed"]
        },
        "trust": {
            "video": ["neutral"],
            "audio": ["Neutral", "Relaxed"]
        },
        "despair": {
            "video": ["sad"],
            "audio": ["Sad"]
        },
        "disappointment": {
            "video": ["sad"],
            "audio": ["Sad"]
        },
        "grief": {
            "video": ["sad"],
            "audio": ["Sad"]
        },
        "nostalgia": {
            "video": ["sad"],
            "audio": ["Sad"]
        },
        "sadness": {
            "video": ["sad"],
            "audio": ["Sad"]
        },
        "curiosity": {
            "video": ["surprise"],
            "audio": ["Tension"]
        },
        "excitement": {
            "video": ["surprise"],
            "audio": ["Tension"]
        },
        "surprise": {
            "video": ["surprise"],
            "audio": ["Tension"]
        },
        "greed": {
            "video": ["neutral"],
            "audio": ["Sad"]
        },
        "guilt": {
            "video": ["neutral"],
            "audio": ["Sad"]
        },
    }
};

type Emotion = string;
type Modality = string;

interface EmotionCompatibility {
    [key: Modality]: Emotion[];
}

interface CompatibilityObj {
    [key: Emotion]: EmotionCompatibility;
}

interface TextCompatibility {
    text: CompatibilityObj;
}

export interface Compatibility {
    text: CompatibilityObj;
    video: CompatibilityObj;
    audio: CompatibilityObj;
}

export function getEmotionCompatibilityObj(textCompatibilityObj: TextCompatibility): Compatibility {
    const emotionCompatibility: Compatibility = { text: textCompatibilityObj.text, video: {}, audio: {} };

    Object.keys(textCompatibilityObj.text).forEach((textEmotion: Emotion) => {
        const { video, audio } = textCompatibilityObj.text[textEmotion];

        video.forEach((videoEmotion: Emotion) => {
            if (!emotionCompatibility.video[videoEmotion]) {
                emotionCompatibility.video[videoEmotion] = { text: [], audio: [] };
            }
            emotionCompatibility.video[videoEmotion].text.push(textEmotion);

            audio.forEach((audioEmotion: Emotion) => {
                if (!emotionCompatibility.video[videoEmotion].audio.includes(audioEmotion)) {
                    emotionCompatibility.video[videoEmotion].audio.push(audioEmotion);
                }
            });
        });

        audio.forEach((audioEmotion: Emotion) => {
            if (!emotionCompatibility.audio[audioEmotion]) {
                emotionCompatibility.audio[audioEmotion] = { text: [], video: [] };
            }
            emotionCompatibility.audio[audioEmotion].text.push(textEmotion);

            video.forEach((videoEmotion: Emotion) => {
                if (!emotionCompatibility.audio[audioEmotion].video.includes(videoEmotion)) {
                    emotionCompatibility.audio[audioEmotion].video.push(videoEmotion);
                }
            });
        });
    });

    return emotionCompatibility;
}
