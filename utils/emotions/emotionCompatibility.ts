export const textCompatibilityObj = {
    "text": {
        "anger": {
            "video": ["angry"],
            "audio": ["tension"]
        },
        "annoyance": {
            "video": ["angry"],
            "audio": ["tension"]
        },
        "disapproval": {
            "video": ["angry"],
            "audio": ["tension"]
        },
        "envy": {
            "video": ["angry"],
            "audio": ["tension"]
        },
        "frustration": {
            "video": ["angry"],
            "audio": ["tension"]
        },
        "disgust": {
            "video": ["disgust"],
            "audio": ["tension"]
        },
        "pain": {
            "video": ["disgust"],
            "audio": ["tension"]
        },
        "doubt": {
            "video": ["fear"],
            "audio": ["tension"]
        },
        "embarrassment": {
            "video": ["fear"],
            "audio": ["tension"]
        },
        "fear": {
            "video": ["fear"],
            "audio": ["tension"]
        },
        "nervousness": {
            "video": ["fear"],
            "audio": ["tension"]
        },
        "admiration": {
            "video": ["happy"],
            "audio": ["pleased"]
        },
        "amusement": {
            "video": ["happy"],
            "audio": ["pleased"]
        },
        "approval": {
            "video": ["happy"],
            "audio": ["pleased"]
        },
        "caring": {
            "video": ["happy"],
            "audio": ["pleased"]
        },
        "courage": {
            "video": ["happy"],
            "audio": ["pleased"]
        },
        "desire": {
            "video": ["happy"],
            "audio": ["pleased"]
        },
        "faith": {
            "video": ["happy"],
            "audio": ["pleased"]
        },
        "gratitude": {
            "video": ["happy"],
            "audio": ["pleased"]
        },
        "joy": {
            "video": ["happy"],
            "audio": ["pleased"]
        },
        "love": {
            "video": ["happy"],
            "audio": ["pleased"]
        },
        "optimism": {
            "video": ["happy"],
            "audio": ["pleased"]
        },
        "pride": {
            "video": ["happy"],
            "audio": ["pleased"]
        },
        "relief": {
            "video": ["happy"],
            "audio": ["pleased"]
        },
        "boredom": {
            "video": ["neutral"],
            "audio": ["neutral", "relaxed"]
        },
        "calmness": {
            "video": ["neutral"],
            "audio": ["neutral", "relaxed"]
        },
        "indifference": {
            "video": ["neutral"],
            "audio": ["neutral", "relaxed"]
        },
        "trust": {
            "video": ["neutral"],
            "audio": ["neutral", "relaxed"]
        },
        "despair": {
            "video": ["sad"],
            "audio": ["sad"]
        },
        "disappointment": {
            "video": ["sad"],
            "audio": ["sad"]
        },
        "grief": {
            "video": ["sad"],
            "audio": ["sad"]
        },
        "nostalgia": {
            "video": ["sad"],
            "audio": ["sad"]
        },
        "sadness": {
            "video": ["sad"],
            "audio": ["sad"]
        },
        "curiosity": {
            "video": ["surprise"],
            "audio": ["tension"]
        },
        "excitement": {
            "video": ["surprise"],
            "audio": ["tension"]
        },
        "surprise": {
            "video": ["surprise"],
            "audio": ["tension"]
        },
        "greed": {
            "video": ["neutral"],
            "audio": ["sad"]
        },
        "guilt": {
            "video": ["neutral"],
            "audio": ["sad"]
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

interface Compatibility {
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
