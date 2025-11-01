import React from "react";

export default function SlideToolbar({ onAddBlock }) {
    return (
        <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h3 className="font-semibold">Blocks</h3>
            <button
                onClick={onAddBlock}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
                + Add Block
            </button>
        </div>
    );
}