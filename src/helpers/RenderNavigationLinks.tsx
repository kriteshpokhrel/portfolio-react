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
 * - activeKey: key of the section currently in view (adds activeClassName)
 */
export function renderNavLinks({
    className = "",
    onClick,
    activeKey,
    activeClassName = "text-white font-semibold",
}: {
    className?: string;
    onClick?: React.MouseEventHandler;
    activeKey?: string;
    activeClassName?: string;
} = {}) {
    return navItems.map((item) => {
        const isActive = activeKey === item.key;
        const cls = `${className} ${isActive ? activeClassName : ""}`.trim();
        const commonProps = {
            className: cls,
            onClick,
        };

        if (item.to) {
            return (
                <Link key={item.key} {...commonProps} to={item.to} >
                    {item.label}
                </Link>
            );
        }

        return (
            <a key={item.key} {...commonProps} href={item.href} aria-current={isActive ? "true" : undefined} >
                {item.label}
            </a>
        );
    });
}