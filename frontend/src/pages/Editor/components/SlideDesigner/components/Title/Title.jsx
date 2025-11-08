import React from 'react';

export default function Title({ styles, block, editableProps }) {
    return (
        <div
            {...editableProps}
            className={styles.titleBlock}
            style={{
                fontFamily: block.style?.fontFamily,
                fontSize: block.style?.fontSize,
                color: block.style?.color,
                fontWeight: block.style?.fontWeight || 'bold',
                textAlign: block.style?.textAlign,
                fontStyle: block.style?.fontStyle,
                textDecoration: block.style?.textDecoration,
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