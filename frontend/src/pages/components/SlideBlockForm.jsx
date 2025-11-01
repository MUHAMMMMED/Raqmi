import React, { useEffect, useState } from "react";
import { createBlock, updateBlock } from "../../api/blocks";


export default function SlideBlockForm({ block, slideId, onSaved, onCancel }) {
    const [form, setForm] = useState({
        type: "text",
        content: "",
        media: null,
        extra: {},
    });

    useEffect(() => {
        if (block) setForm(block);
    }, [block]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFile = (e) => {
        setForm((prev) => ({ ...prev, media: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in form) {
            formData.append(key, form[key]);
        }
        formData.append("slide", slideId);

        if (block) await updateBlock(block.id, formData);
        else await createBlock(formData);
        onSaved();
    };

    return (
        <form className="p-3 space-y-3" onSubmit={handleSubmit}>
            <label className="block">
                <span className="text-sm font-semibold">Type</span>
                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                >
                    <option value="title">Title</option>
                    <option value="text">Text</option>
                    <option value="bullet_points">Bullet Points</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="quote">Quote</option>
                    <option value="code">Code</option>
                </select>
            </label>

            {["title", "text", "bullet_points", "quote", "code"].includes(form.type) && (
                <textarea
                    name="content"
                    value={form.content || ""}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    rows="4"
                    placeholder="Enter text..."
                />
            )}

            {["image", "video"].includes(form.type) && (
                <input
                    type="file"
                    onChange={handleFile}
                    accept={form.type === "image" ? "image/*" : "video/*"}
                />
            )}

            <div className="flex gap-2 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="border px-3 py-1 rounded text-sm"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                    {block ? "Update" : "Add"}
                </button>
            </div>
        </form>
    );
}