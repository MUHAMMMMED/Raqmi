import React, { useState } from "react";

export default function VoicePreview({ text }) {
    const [playing, setPlaying] = useState(false);

    const handlePlay = () => {
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
        setPlaying(true);
        utterance.onend = () => setPlaying(false);
    };

    return (
        <button
            onClick={handlePlay}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            {playing ? "Playing..." : "Preview Voice"}
        </button>
    );
}