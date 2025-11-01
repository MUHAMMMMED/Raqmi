import React from "react";

export default function SlideItem({ slide, onSelect }) {
    return (
        <div
            className="border rounded-lg p-3 cursor-pointer hover:bg-gray-100"
            onClick={() => onSelect(slide)}
        >
            <h3 className="font-semibold">{slide.title || "Untitled Slide"}</h3>
            <p className="text-xs text-gray-500">{slide.layout_style}</p>
        </div>
    );
}