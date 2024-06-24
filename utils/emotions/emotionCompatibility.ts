export const textCompatibilityObj = {
    "text": {
        "anger": {
            "video": ["angry","neutral","fear","sad"],
            "audio": ["Tension","Neutral","Relaxed","Sad"]
        },
        "annoyance": {
            "video": ["angry","neutral","fear","sad"],
            "audio": ["Tension","Neutral","Relaxed","Sad"]
        },
        "disapproval": {
            "video": ["angry","neutral","fear","sad"],
            "audio": ["Tension","Neutral","Relaxed","Sad"]
        },
        "envy": {
            "video": ["angry","neutral","fear","sad"],
            "audio": ["Tension","Neutral","Relaxed","Sad"]
        },
        "frustration": {
            "video": ["angry","neutral","fear","sad"],
            "audio": ["Tension","Neutral","Relaxed","Sad"]
        },
        "disgust": {
            "video": ["surprise","neutral","angry","disgust","happy","fear","sad"],
            "audio": ["Relaxed","Neutral","Tension"]
        },
        "pain": {
            "video": ["sad","neutral","angry","fear"],
            "audio": ["Sad","Neutral","Relaxed","Tension"]
        },
        "doubt": {
            "video": ["fear","neutral","angry","sad"],
            "audio": ["Tension","Neutral","Sad"]
        },
        "embarrassment": {
            "video": ["sad","neutral","angry","fear"],
            "audio": ["Sad","Neutral","Relaxed","Tension"]
        },
        "fear": {
            "video": ["fear","neutral","angry","sad"],
            "audio": ["Tension","Neutral","Sad"]
        },
        "nervousness": {
            "video": ["fear","neutral","angry","sad"],
            "audio": ["Tension","Neutral","Sad"]
        },
        "admiration": {
            "video": ["angry","disgust","happy","fear","surprise","sad"],
            "audio": ["Neutral","Pleased","Relaxed","Tension","Sad"]
        },
        "amusement": {
            "video": ["angry","disgust","happy","fear","surprise","sad"],
            "audio": ["Neutral","Pleased","Relaxed","Tension","Sad"]
        },
        "approval": {
            "video": ["angry","disgust","happy","fear","surprise","sad"],
            "audio": ["Neutral","Pleased","Relaxed","Tension","Sad"]
        },
        "caring": {
            "video": ["angry","disgust","happy","fear","surprise","sad"],
            "audio": ["Neutral","Pleased","Relaxed","Tension","Sad"]
        },
        "courage": {
            "video": ["angry","disgust","happy","fear","surprise","sad"],
            "audio": ["Neutral","Pleased","Relaxed","Tension","Sad"]
        },
        "desire": {
            "video": ["angry","disgust","happy","fear","surprise","sad"],
            "audio": ["Neutral","Pleased","Relaxed","Tension","Sad"]
        },
        "faith": {
            "video": ["angry","disgust","happy","fear","surprise","sad"],
            "audio": ["Neutral","Pleased","Relaxed","Tension","Sad"]
        },
        "gratitude": {
            "video": ["happy","neutral","surprise"],
            "audio": ["Pleased","Relaxed","Neutral"]
        },
        "joy": {
            "video": ["happy","neutral","surprise"],
            "audio": ["Pleased","Relaxed","Neutral"]
        },
        "love": {
            "video": ["happy","neutral","surprise"],
            "audio": ["Pleased","Relaxed","Neutral"]
        },
        "optimism": {
            "video": ["happy","neutral","surprise"],
            "audio": ["Pleased","Relaxed","Neutral"]
        },
        "pride": {
            "video": ["angry","disgust","happy","fear","surprise","sad"],
            "audio": ["Neutral","Pleased","Relaxed","Tension","Sad"]
        },
        "relief": {
            "video": ["angry","disgust","happy","fear","surprise","sad"],
            "audio": ["Neutral","Pleased","Relaxed","Tension","Sad"]
        },
        "boredom": {
            "video": ["angry","disgust","happy","fear","surprise","sad"],
            "audio": ["Neutral","Pleased","Relaxed","Tension","Sad"]
        },
        "calmness": {
            "video": ["angry","disgust","happy","fear","surprise","sad"],
            "audio": ["Neutral","Pleased","Relaxed","Tension","Sad"]
        },
        "indifference": {
            "video": ["angry","disgust","happy","fear","surprise","sad"],
            "audio": ["Neutral","Pleased","Relaxed","Tension","Sad"]
        },
        "trust": {
            "video": ["angry","disgust","happy","fear","surprise","sad"],
            "audio": ["Neutral","Pleased","Relaxed","Tension","Sad"]
        },
        "despair": {
            "video": ["sad","neutral","angry","fear"],
            "audio": ["Sad","Neutral","Relaxed","Tension"]
        },
        "disappointment": {
            "video": ["angry","neutral","fear","sad"],
            "audio": ["Tension","Neutral","Relaxed","Sad"]
        },
        "grief": {
            "video": ["sad","neutral","angry","fear"],
            "audio": ["Sad","Neutral","Relaxed","Tension"]
        },
        "nostalgia": {
            "video": ["sad","neutral","angry","fear"],
            "audio": ["Sad","Neutral","Relaxed","Tension"]
        },
        "sadness": {
            "video": ["sad","neutral","angry","fear"],
            "audio": ["Sad","Neutral","Relaxed","Tension"]
        },
        "curiosity": {
            "video": ["angry","disgust","happy","fear","surprise","sad"],
            "audio": ["Neutral","Pleased","Relaxed","Tension","Sad"]
        },
        "excitement": {
            "video": ["happy","neutral","surprise"],
            "audio": ["Pleased","Relaxed","Neutral"]
        },
        "surprise": {
            "video": ["surprise","neutral","angry","disgust","happy","fear","sad"],
            "audio": ["Neutral","Relaxed","Pleased","Tension","Sad"]
        },
        "greed": {
            "video": ["angry","disgust","happy","fear","surprise","sad"],
            "audio": ["Neutral","Pleased","Relaxed","Tension","Sad"]
        },
        "guilt": {
            "video": ["fear","neutral","angry","sad"],
            "audio": ["Tension","Neutral","Sad"]
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
