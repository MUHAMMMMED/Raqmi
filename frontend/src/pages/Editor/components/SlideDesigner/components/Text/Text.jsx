import React from 'react';

export default function Text({ styles, block, editableProps }) {
    return (
        <div
            {...editableProps}
            className={styles.textBlock}
            style={{
                fontFamily: block.style?.fontFamily,
                fontSize: block.style?.fontSize,
                color: block.style?.color,
                textAlign: block.style?.textAlign,
                lineHeight: '1.6',
                fontStyle: block.style?.fontStyle,
                textDecoration: block.style?.textDecoration,
                fontWeight: block.style?.fontWeight,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                padding: '4px',
                boxSizing: 'border-box',
            }}
        >
            {block.content}
        </div>
    );
}