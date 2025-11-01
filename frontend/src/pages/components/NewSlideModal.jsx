import React, { useState } from "react";

export default function NewSlideModal({ onSave }) {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    const handleSave = () => {
        if (!title.trim()) return;
        onSave({ title, text });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h3 className="text-lg font-semibold mb-2">Create New Slide</h3>
                <input
                    type="text"
                    placeholder="Title"
                    className="border p-2 w-full mb-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Slide Text"
                    className="border p-2 w-full mb-3"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                >
                    Save
                </button>
            </div>
        </div>
    );
}