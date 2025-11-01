import { useEffect, useState } from "react";
import { createBlock, deleteBlock, getBlocks, updateBlock } from "../api/slides";
import NewSlideModal from "./NewSlideModal";
import SlideItem from "./SlideItem";
import Toolbar from "./Toolbar";

export default function SlideEditor({ slide }) {
    const [blocks, setBlocks] = useState([]);
    const [showNewModal, setShowNewModal] = useState(false);

    useEffect(() => {
        if (slide?.id) {
            getBlocks(slide.id).then(setBlocks);
        }
    }, [slide]);

    const handleAddBlock = async (type) => {
        const newBlock = await createBlock({ slide: slide.id, type, order: blocks.length });
        setBlocks([...blocks, newBlock]);
    };

    const handleUpdateBlock = async (id, field, value) => {
        const updated = await updateBlock(id, { [field]: value });
        setBlocks(blocks.map((b) => (b.id === id ? updated : b)));
    };

    const handleDeleteBlock = async (id) => {
        await deleteBlock(id);
        setBlocks(blocks.filter((b) => b.id !== id));
    };

    return (
        <div className="flex flex-col p-4 gap-3 bg-gray-50 rounded-lg shadow-md">
            <Toolbar onAddBlock={handleAddBlock} onShowNew={() => setShowNewModal(true)} />

            <div className="grid gap-2">
                {blocks.map((block) => (
                    <SlideItem
                        key={block.id}
                        block={block}
                        onChange={handleUpdateBlock}
                        onDelete={handleDeleteBlock}
                    />
                ))}
            </div>

            {showNewModal && (
                <NewSlideModal
                    onClose={() => setShowNewModal(false)}
                    onCreate={(type) => handleAddBlock(type)}
                />
            )}
        </div>
    );
}