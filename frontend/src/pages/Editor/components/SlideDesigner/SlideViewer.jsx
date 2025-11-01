
import React from 'react';
import styles from './SlideDesigner.module.css';

const SlideViewer = ({ slide }) => {
    if (!slide) return <div>لا يوجد سلايد لعرضه</div>;

    const renderBlock = (block) => {
        const blockStyle = {
            position: 'absolute',
            left: `${block.position?.x || 0}px`,
            top: `${block.position?.y || 0}px`,
            width: `${block.size?.width || 200}px`,
            height: `${block.size?.height || 100}px`
        };

        let content;

        switch (block.type) {
            case 'title':
                content = (
                    <div
                        className={styles.titleBlock}
                        style={{
                            fontFamily: block.style?.fontFamily,
                            fontSize: block.style?.fontSize,
                            color: block.style?.color,
                            fontWeight: block.style?.fontWeight,
                            textAlign: block.style?.textAlign
                        }}
                    >
                        {block.content}
                    </div>
                );
                break;

            case 'text':
                content = (
                    <div
                        className={styles.textBlock}
                        style={{
                            fontFamily: block.style?.fontFamily,
                            fontSize: block.style?.fontSize,
                            color: block.style?.color,
                            textAlign: block.style?.textAlign
                        }}
                    >
                        {block.content}
                    </div>
                );
                break;

            case 'bullet_points':
                const points = block.content.split('\n').filter(point => point.trim());
                content = (
                    <div
                        className={styles.bulletBlock}
                        style={{
                            fontFamily: block.style?.fontFamily,
                            fontSize: block.style?.fontSize,
                            color: block.style?.color,
                            textAlign: block.style?.textAlign
                        }}
                    >
                        <ul>
                            {points.map((point, index) => (
                                <li key={index}>{point.replace('•', '').trim()}</li>
                            ))}
                        </ul>
                    </div>
                );
                break;

            case 'quote':
                content = (
                    <div
                        className={styles.quoteBlock}
                        style={{
                            fontFamily: block.style?.fontFamily,
                            fontSize: block.style?.fontSize,
                            color: block.style?.color,
                            fontStyle: block.style?.fontStyle,
                            borderLeftColor: block.style?.borderColor || '#4299e1'
                        }}
                    >
                        {block.content}
                    </div>
                );
                break;

            case 'code':
                content = (
                    <div
                        className={styles.codeBlock}
                        style={{
                            fontFamily: block.style?.fontFamily || 'Courier New, monospace',
                            fontSize: block.style?.fontSize,
                            backgroundColor: block.style?.backgroundColor,
                            color: block.style?.color
                        }}
                    >
                        <pre>{block.content}</pre>
                    </div>
                );
                break;

            case 'image':
                content = (
                    <div className={styles.imageBlock}>
                        {block.media ? (
                            <img src={block.media} alt="Block content" />
                        ) : (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#718096'
                            }}>
                                صورة
                            </div>
                        )}
                    </div>
                );
                break;

            case 'video':
                content = (
                    <div className={styles.videoBlock}>
                        {block.media ? (
                            <video controls>
                                <source src={block.media} type="video/mp4" />
                                متصفحك لا يدعم تشغيل الفيديو
                            </video>
                        ) : (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#718096'
                            }}>
                                فيديو
                            </div>
                        )}
                    </div>
                );
                break;

            default:
                content = <div>{block.content}</div>;
        }

        return (
            <div key={block.id} style={blockStyle}>
                {content}
            </div>
        );
    };

    return (
        <div className={styles.slideArea}>
            <div
                className={styles.slideContainer}
                style={{
                    backgroundColor: slide.background_color || '#FFFFFF',
                    backgroundImage: slide.background_image ? `url(${slide.background_image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {slide.blocks && slide.blocks.map(renderBlock)}
            </div>
        </div>
    );
};

export default SlideViewer;