import React from "react";
import { Link } from "react-router-dom";

export const navItems = [
    { key: "home", label: "Home", href: "#home" },
    { key: "about", label: "About", href: "#about" },
    { key: "projects", label: "Projects", href: "#projects" },
    { key: "contact", label: "Contact", href: "#contact" },
    { key: "blogs", label: "Blogs", to: "/blogs" },
];

/**
 * renderNavLinks
 * - className: applied to every link element
 * - onClick: optional click handler (e.g. to close mobile menu)
 */
export function renderNavLinks({ className = "", onClick }: { className?: string; onClick?: React.MouseEventHandler } = {}) {
    return navItems.map((item) => {
        const commonProps = {
            key: item.key,
            className,
            onClick,
        };

        if (item.to) {
            return (
                <Link {...commonProps} to={item.to} >
                    {item.label}
                </Link>
            );
        }

        return (
            <a {...commonProps} href={item.href} >
                {item.label}
            </a>
        );
    });
}