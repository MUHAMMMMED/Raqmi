import React from 'react';

const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '255, 255, 255';
};

export default function Code({ block, styles, editableProps }) {
    return (
        <div
            {...editableProps}
            className={styles.codeBlock}
            style={{
                fontFamily: block.style?.fontFamily || 'Courier New, monospace',
                fontSize: block.style?.fontSize,
                backgroundColor: block.style?.backgroundColor
                    ? `rgba(${hexToRgb(block.style.backgroundColor)}, ${block.backgroundOpacity || 1})`
                    : '#2d3748',
                color: block.style?.color || '#e2e8f0',
                width: '100%',
                height: '100%',
                overflow: 'auto',
                padding: '12px',
                boxSizing: 'border-box',
                whiteSpace: 'pre',
                fontSize: '14px',
                lineHeight: '1.5',
            }}
        >
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {block.content}
            </pre>
        </div>
    );
}