import { Link } from "react-router-dom";

export function UnderlineLink({ children, to, href, external }) {
    const cls = "footer-link";
    if (external) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
    }
    return <Link to={to} className={cls}>{children}</Link>;
}