import React from 'react';
import {
    FaImage
} from 'react-icons/fa';
export default function Image({ block, styles }) {

    return (
        <div
            className={styles.imageBlock}
            style={{
                opacity: block.backgroundOpacity !== undefined ? block.backgroundOpacity : 1
            }}
        >
            {block.media ? (
                <img
                    src={block.media}
                    alt="Block content"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
            ) : (
                <div className={styles.mediaPlaceholder}>
                    <FaImage size={32} />
                    <span>Image</span>
                </div>
            )}
        </div>
    )
}
