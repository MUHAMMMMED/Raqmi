
import React from 'react';
import {
    FaVideo
} from 'react-icons/fa';

export default function Video({ block, styles }) {
    return (
        <div
            className={styles.videoBlock}
            style={{
                opacity: block.backgroundOpacity !== undefined ? block.backgroundOpacity : 1
            }}
        >
            {block.media ? (
                <video controls style={{ width: '100%', height: '100%' }}>
                    <source src={block.media} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <div className={styles.mediaPlaceholder}>
                    <FaVideo size={32} />
                    <span>Video</span>
                </div>
            )}
        </div>
    )
}
