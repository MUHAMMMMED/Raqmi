import React from "react";

export default function ColorPicker({ value, onChange }) {
    return (
        <div className="flex items-center space-x-2">
            <label>Color:</label>
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-10 h-10 border rounded"
            />
        </div>
    );
}