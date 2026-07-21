import { Link } from "react-router-dom";

export function UnderlineLink({ children, to, href, external, className = "", ...rest }) {
    const combinedClass = `footer-link ${className}`.trim();

    // Es externo si se indica explícitamente O si trae una URL tipo "href" o "mailto:"
    const isExternal = external || Boolean(href) || (typeof to === "string" && (to.startsWith("http") || to.startsWith("mailto:")));
    const destination = href || to;

    if (isExternal) {
        return (
            <a
                href={destination}
                target="_blank"
                rel="noopener noreferrer"
                className={combinedClass}
                {...rest}
            >
                {children}
            </a>
        );
    }

    return (
        <Link to={to} className={combinedClass} {...rest}>
            {children}
        </Link>
    );
}