import { Link } from "react-router-dom";
import { optimizeCloudinaryImage } from "../../../lib/optimizeCloudinaryImage";
import { formatBlogDate } from "./blogUtils";
import "../../../pages/BlogPostPage.css";

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
            <div className="blogpost-hero">
                <h1 className="blogpost-title">{title}</h1>
                <div className="blogpost-nav-top" style={{ alignItems: "flex-start" }}>
                    {preview ? <span /> : (
                        <Link to="/blog" className="blogpost-back">
                            <span className="blogpost-dot" />
                            Todos los artículos
                        </Link>
                    )}

                    {preview || !showDate ? <span /> : <span className="blogpost-date">{createdLabel}</span>}
                </div>
            </div>

            <div className="blogpost-body">
                <div className="blogpost-img-wrap" style={{ position: "relative" }}>
                    {currentImage ? (

                        <img
                            src={optimizeCloudinaryImage(currentImage)}
                            alt={title}
                            className="blogpost-img"
                        />
                    ) : (
                        <div className="skeleton" style={{ width: "100%", height: 220, borderRadius: 8 }} />
                    )}
                </div>

                <div className="blogpost-text">
                    {String(body || "")
                        .split("\n\n")
                        .filter(Boolean)
                        .map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                </div>

                {!preview && nextPost?.id && (
                    <div className="blogpost-next">
                        <Link to={`/blog/${nextPost.id}`} className="blogpost-next-link">
                            Siguiente artículo
                            <span className="blogpost-dot blogpost-dot--green" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}