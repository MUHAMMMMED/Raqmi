
import React from 'react';


export default function Points({ points = [], block, styles: componentStyles }) {
    // حماية من القيم غير الموجودة
    if (!points || points.length === 0) {
        return (
            <div
                className={componentStyles?.bulletBlock}
                style={{
                    fontFamily: block.style?.fontFamily || 'Arial, sans-serif',
                    fontSize: block.style?.fontSize || '18px',
                    color: block.style?.color || '#000000',
                    textAlign: block.style?.textAlign || 'right',
                    fontStyle: block.style?.fontStyle || 'normal',
                    textDecoration: block.style?.textDecoration || 'none',
                    fontWeight: block.style?.fontWeight || 'normal',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#aaa',
                    fontStyle: 'italic',
                    overflow: 'hidden',
                }}
            >
                لا توجد نقاط
            </div>
        );
    }

    return (
        <div
            className={componentStyles?.bulletBlock}
            style={{
                fontFamily: block.style?.fontFamily || 'Arial, sans-serif',
                fontSize: block.style?.fontSize || '18px',
                color: block.style?.color || '#000000',
                textAlign: block.style?.textAlign || 'right',
                fontStyle: block.style?.fontStyle || 'normal',
                textDecoration: block.style?.textDecoration || 'none',
                fontWeight: block.style?.fontWeight || 'normal',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                padding: '8px',
                boxSizing: 'border-box',
                opacity: block.opacity ?? 1,
                backgroundOpacity: block.backgroundOpacity ?? 1,
            }}
        >
            <ul
                style={{
                    margin: 0,
                    paddingRight: block.style?.textAlign === 'right' ? '1.5em' : '0',
                    paddingLeft: block.style?.textAlign === 'left' ? '1.5em' : '0',
                    listStyleType: 'disc',
                    textAlign: 'inherit',
                }}
            >
                {points.map((point, index) => (
                    <li
                        key={index}
                        style={{
                            marginBottom: '0.35em',
                            lineHeight: 1.4,
                        }}
                    >
                        {point.replace(/^[\u2022\s]*/, '').trim()}
                    </li>
                ))}
            </ul>
        </div>
    );
}