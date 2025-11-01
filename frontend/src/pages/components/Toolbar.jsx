export default function Toolbar({ onAddBlock }) {
    const blockTypes = ["title", "text", "image", "video", "bullet_points"];

    return (
        <div className="flex gap-2 mb-2">
            {blockTypes.map((type) => (
                <button
                    key={type}
                    onClick={() => onAddBlock(type)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                    + {type}
                </button>
            ))}
        </div>
    );
}