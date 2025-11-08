import React from 'react';

const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '255, 255, 255';
};

export default function Quote({ block, styles, editableProps }) {
    return (
        <div
            {...editableProps}
            className={styles.quoteBlock}
            style={{
                fontFamily: block.style?.fontFamily,
                fontSize: block.style?.fontSize,
                color: block.style?.color,
                fontStyle: block.style?.fontStyle || 'italic',
                textDecoration: block.style?.textDecoration,
                fontWeight: block.style?.fontWeight,
                borderLeft: `4px solid ${block.style?.borderColor || '#4299e1'}`,
                paddingLeft: '16px',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                backgroundColor: block.style?.backgroundColor
                    ? `rgba(${hexToRgb(block.style.backgroundColor)}, ${block.backgroundOpacity || 1})`
                    : 'transparent',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                padding: '8px',
                boxSizing: 'border-box',
            }}
        >
            {block.content}
        </div>
    );
}