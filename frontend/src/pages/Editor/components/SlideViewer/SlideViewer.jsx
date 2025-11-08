import React from "react";
import styles from "./SlideViewer.module.css";

export default function SlideViewer({ slide, blocks = [] }) {
    const hexToRgb = (hex) => {
        if (!hex) return "255, 255, 255";
        const c = hex.replace("#", "");
        const r = parseInt(c.substring(0, 2), 16);
        const g = parseInt(c.substring(2, 4), 16);
        const b = parseInt(c.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
    };

    const getOpacity = (value) => Math.max(0, Math.min(1, parseFloat(value) || 1));

    const renderBlockContent = (block) => {
        switch (block.type) {
            case "image":
                return block.image_url ? (
                    <img
                        src={block.image_url}
                        alt=""
                        className={styles.mediaImage}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                ) : (
                    <div className={styles.mediaPlaceholder}><span>لا توجد صورة</span></div>
                );

            case "video":
                return block.video_url ? (
                    <video
                        src={block.video_url}
                        controls
                        className={styles.mediaVideo}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                ) : (
                    <div className={styles.mediaPlaceholder}><span>لا يوجد فيديو</span></div>
                );

            case "title":
                return (
                    <h3 style={{
                        margin: 0,
                        textAlign: block.text_align || "right",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            block.text_align === "center"
                                ? "center"
                                : block.text_align === "left"
                                    ? "flex-start"
                                    : "flex-end"
                    }}>
                        {block.content}
                    </h3>
                );

            case "text":
                return (
                    <p style={{
                        margin: 0,
                        textAlign: block.text_align || "right",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            block.text_align === "center"
                                ? "center"
                                : block.text_align === "left"
                                    ? "flex-start"
                                    : "flex-end"
                    }}>
                        {block.content}
                    </p>
                );

            case "bullet_points":
                return (
                    <ul style={{
                        margin: 0,
                        paddingRight: "20px",
                        textAlign: block.text_align || "right",
                        width: "100%",
                        height: "100%",
                        direction: "rtl"
                    }}>
                        {block.content?.split("\n").filter(line => line.trim()).map((line, i) => (
                            <li key={i} style={{ marginBottom: "4px" }}>
                                {line.replace(/^[•-]\s*/, "").trim()}
                            </li>
                        ))}
                    </ul>
                );

            case "quote":
                return (
                    <blockquote style={{
                        margin: 0,
                        padding: "10px 20px",
                        borderRight: "4px solid #4299e1",
                        fontStyle: "italic",
                        background: "#f7fafc",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        textAlign: block.text_align || "right",
                        boxSizing: "border-box"
                    }}>
                        {block.content}
                    </blockquote>
                );

            case "code":
                return (
                    <pre style={{
                        margin: 0,
                        fontFamily: "monospace",
                        background: "#2d3748",
                        color: "#e2e8f0",
                        padding: "12px",
                        borderRadius: "4px",
                        overflow: "auto",
                        whiteSpace: "pre-wrap",
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box"
                    }}>
                        <code>{block.content}</code>
                    </pre>
                );

            default:
                return (
                    <div style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        {block.content}
                    </div>
                );
        }
    };

    return (

        <div
            className={styles.container}
            style={{
                background: slide?.background_image_url
                    ? `rgba(${hexToRgb(slide.background_color)}, ${getOpacity(slide.background_opacity)}) url(${slide.background_image_url}) center/cover no-repeat`
                    : `rgba(${hexToRgb(slide?.background_color || "#FFFFFF")}, ${getOpacity(slide?.background_opacity || 1)})`,
                width: "800px",
                height: "450px",
                position: "relative",
                overflow: "hidden",
                borderRadius: "8px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
            }}
        >
            {blocks
                .sort((a, b) => (a.z_index || 0) - (b.z_index || 0))
                .map((block) => {
                    const pos = {
                        x: block.position_x || block.position?.x || 100,
                        y: block.position_y || block.position?.y || 100
                    };
                    const size = {
                        width: block.width || block.size?.width || 200,
                        height: block.height || block.size?.height || 100
                    };

                    const blockStyle = {
                        left: `${pos.x}px`,
                        top: `${pos.y}px`,
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                        zIndex: block.z_index || 1,
                        opacity: getOpacity(block.opacity),
                        fontFamily: block.font_family || "Arial, sans-serif",
                        fontSize: `${block.font_size || 18}px`,
                        color: block.font_color || "#000",
                        fontWeight: block.font_weight || "normal",
                        fontStyle: block.font_style || "normal",
                        textDecoration: block.text_decoration || "none",
                        textAlign: block.text_align || "right",
                        backgroundColor:
                            block.background_color === "transparent" || !block.background_color
                                ? "transparent"
                                : `rgba(${hexToRgb(block.background_color)}, ${getOpacity(block.background_opacity || 1)})`,
                        borderRadius: `${block.border_radius || 0}px`,
                        border: block.border_width > 0
                            ? `${block.border_width}px solid ${block.border_color || "#000"}`
                            : "none",
                        padding: "8px",
                        boxSizing: "border-box",
                        overflow: "hidden",
                        position: "absolute"
                    };

                    return (
                        <div key={block.id} className={styles.block} style={blockStyle}>
                            {renderBlockContent(block)}
                        </div>
                    );
                })}

        </div>
    );
}