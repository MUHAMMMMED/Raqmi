import React from "react";

const fonts = ["Arial", "Roboto", "Times New Roman", "Poppins", "Cairo"];

export default function FontPicker({ value, onChange }) {
    return (
        <div className="flex items-center space-x-2">
            <label>Font:</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border rounded p-2"
            >
                {fonts.map((font) => (
                    <option key={font} value={font}>
                        {font}
                    </option>
                ))}
            </select>
        </div>
    );
}