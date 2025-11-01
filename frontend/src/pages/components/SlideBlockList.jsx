import React from "react";
import SlideBlock from "./SlideBlock";

export default function SlideBlockList({ blocks, onEdit, onDelete }) {
    return (
        <div className="space-y-2">
            {blocks.map((block) => (
                <div key={block.id} className="border p-2 rounded relative group">
                    <SlideBlock block={block} />
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                            className="text-xs bg-yellow-200 px-2 py-1 rounded mr-1"
                            onClick={() => onEdit(block)}
                        >
                            Edit
                        </button>
                        <button
                            className="text-xs bg-red-200 px-2 py-1 rounded"
                            onClick={() => onDelete(block.id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}