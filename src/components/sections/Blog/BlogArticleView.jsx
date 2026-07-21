import { Link } from "react-router-dom";
import { optimizeCloudinaryImage } from "../../../lib/optimizeCloudinaryImage";
import { formatBlogDate } from "./blogUtils";
import "../../../pages/BlogPostPage.css";
import { Button, Image, Skeleton } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

const GREEN_COLOR = "#2e7d32";

export default function BlogArticleView({ post: userPost, nextPost = null, preview = false, showDate = true }) {
    const images = Array.isArray(userPost?.imagenes)
        ? userPost.imagenes
            .map((item) => {
                if (!item) return null;
                if (typeof item === "string") return item;
                return item.url || item.src || item.image || null;
            })
            .filter(Boolean)
        : (userPost?.imagen || userPost?.image || userPost?.img ? [userPost.imagen || userPost.image || userPost.img] : []);

    const title = userPost?.title || userPost?.titulo || "Noticia";
    const body = userPost?.body || userPost?.descripcion || "";
    const currentImage = images.length > 0 ? images[0] : null;
    const createdLabel = formatBlogDate(userPost?.createdAt || userPost?.date);

    return (
        <div className="blogpost">
            {/* Cabecera del Post */}
            <div className="blogpost-hero">
                <h1 className="blogpost-title">{title}</h1>
                <div
                    className="blogpost-nav-top"
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}
                >
                    {!preview ? (
                        <Link to="/blog">
                            <Button type="text" icon={<ArrowLeftOutlined style={{ color: GREEN_COLOR }} />}>
                                Volver al blog
                            </Button>
                        </Link>
                    ) : (
                        <span />
                    )}

                    {!preview && showDate && (
                        <span className="blogpost-date" style={{ color: "#8c8c8c", fontSize: "0.9rem" }}>
                            {createdLabel}
                        </span>
                    )}
                </div>
            </div>

            {/* Cuerpo del Artículo */}
            <div className="blogpost-body" style={{ marginTop: 24 }}>
                {/* Imagen Principal */}
                <div
                    className="blogpost-img-wrap"
                    style={{
                        position: "relative",
                        width: "100%",
                        maxHeight: 420,
                        borderRadius: 12,
                        overflow: "hidden",
                        backgroundColor: "#f5f5f5",
                        marginBottom: 24,
                    }}
                >
                    {currentImage ? (
                        <Image
                            src={optimizeCloudinaryImage(currentImage, { width: 1000 })}
                            alt={title}
                            wrapperStyle={{ width: "100%", height: "100%" }}
                            style={{
                                width: "100%",
                                maxHeight: 420,
                                objectFit: "cover",
                                objectPosition: "center",
                                borderRadius: 12,
                            }}
                            preview={{
                                src: optimizeCloudinaryImage(currentImage, { width: 1600 }),
                            }}
                        />
                    ) : (
                        <Skeleton.Image active style={{ width: "100%", height: 260 }} />
                    )}
                </div>

                {/* Texto del Artículo */}
                <div className="blogpost-text" style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "#262626" }}>
                    {String(body || "")
                        .split("\n\n")
                        .filter(Boolean)
                        .map((paragraph, i) => (
                            <p key={i} style={{ marginBottom: 16 }}>
                                {paragraph}
                            </p>
                        ))}
                </div>

                {/* Enlace al Siguiente Artículo */}
                {!preview && nextPost?.id && (
                    <div className="blogpost-next" style={{ marginTop: 40, textAlign: "right" }}>
                        <Link to={`/blog/${nextPost.id}`}>
                            <Button
                                type="primary"
                                style={{ backgroundColor: GREEN_COLOR, borderColor: GREEN_COLOR }}
                            >
                                Siguiente artículo
                                <ArrowRightOutlined />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}