import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./BlogCard.css";
import { optimizeCloudinaryImage } from '../../lib/optimizeCloudinaryImage';
import { normalizeBlogImages } from "./blogUtils";

export default function BlogCard({ post }) {
  const { id, date, title, img } = post;
  const images = normalizeBlogImages(post);
  const current = images.length > 0 ? images[0] : (img || null);

  return (
    <Link to={`/blog/${id}`} className="blog-card">
      <div className="blog-card-inner">

        {/* Top: fecha izquierda + foto derecha */}
        <div className="blog-card-top">
          <span className="blog-card-date">{date}</span>
          <div className="blog-card-img-wrap" style={{ position: "relative" }}>
            {current ? <img src={optimizeCloudinaryImage(current)} alt={title} className="blog-card-img" /> : <div className="skeleton" style={{ width: "100%", height: "100%" }} />}
          </div>
        </div>

        {/* Título abajo izquierda */}
        <div className="blog-card-title">{title}</div>

      </div>
    </Link>
  );
}
