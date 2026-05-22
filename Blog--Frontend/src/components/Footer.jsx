import { NavLink } from "react-router";
import {
    navBrandClass,
    mutedText,
    linkClass,
    divider,
    tagClass,
} from "../styles/common";

const FOOTER_LINKS = {
    Explore: ["Home", "Topics", "Writers", "About"],
    Account: ["Register", "Login", "Profile"],
    Legal: ["Privacy Policy", "Terms of Use", "Cookie Policy"],
};

const ROUTE_MAP = {
    Home: "/",
    Register: "/register",
    Login: "/login",
    Profile: "/user-profile",
};

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-[#e8e8ed] mt-10">
            {/* Main footer grid */}
            <div className="max-w-5xl mx-auto px-6 py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                    {/* Brand column */}
                    <div className="flex flex-col gap-4">
                        <NavLink to="/" className={navBrandClass} style={{ fontSize: "1.1rem" }}>
                            Zenith Blogs
                        </NavLink>
                        <p className={`${mutedText} leading-relaxed`} style={{ fontSize: "0.8rem", maxWidth: "180px" }}>
                            Ideas worth thinking about. Stories that matter, every week.
                        </p>
                    </div>

                    {Object.entries(FOOTER_LINKS).map(([group, links]) => (
                        <div key={group} className="flex flex-col gap-3">
                            <p
                                className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#a1a1a6]"
                                style={{ marginBottom: "4px" }}
                            >
                                {group}
                            </p>
                            {links.map((label) => {
                                const to = ROUTE_MAP[label];
                                return to ? (
                                    <NavLink
                                        key={label}
                                        to={to}
                                        className="text-[0.82rem] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                                    >
                                        {label}
                                    </NavLink>
                                ) : (
                                    <a
                                        key={label}
                                        href="#"
                                        className="text-[0.82rem] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                                    >
                                        {label}
                                    </a>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className={divider} />

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className={mutedText} style={{ fontSize: "0.75rem" }}>
                        © {year} Zenith Blogs. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;