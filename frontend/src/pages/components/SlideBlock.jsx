import React from "react";

export default function SlideBlock({ block }) {
    switch (block.type) {
        case "title":
            return <h2 className="text-xl font-bold">{block.content}</h2>;
        case "text":
            return <p>{block.content}</p>;
        case "bullet_points":
            return (
                <ul className="list-disc pl-4">
                    {block.content.split("\n").map((line, i) => (
                        <li key={i}>{line}</li>
                    ))}
                </ul>
            );
        case "image":
            return <img src={block.media} alt="" className="max-w-full rounded" />;
        case "video":
            return (
                <video controls className="max-w-full rounded">
                    <source src={block.media} type="video/mp4" />
                </video>
            );
        default:
            return null;
    }
}