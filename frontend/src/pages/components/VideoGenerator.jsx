import React, { useState } from "react";
import { checkVideoProgress, generateVideo } from "../api/video";

export default function VideoGenerator({ lessonId }) {
    const [progress, setProgress] = useState(0);
    const [videoUrl, setVideoUrl] = useState(null);

    const handleGenerate = async () => {
        const { task_id } = await generateVideo(lessonId);
        const interval = setInterval(async () => {
            const res = await checkVideoProgress(task_id);
            setProgress(res.progress);
            if (res.status === "done") {
                setVideoUrl(res.url);
                clearInterval(interval);
            }
        }, 3000);
    };

    return (
        <div className="p-4 border rounded bg-gray-50 mt-4">
            <button onClick={handleGenerate} className="bg-blue-600 text-white px-4 py-2 rounded">
                Generate Video
            </button>
            {progress > 0 && <p>Progress: {progress}%</p>}
            {videoUrl && <video controls src={videoUrl} className="mt-2 w-full rounded" />}
        </div>
    );
}