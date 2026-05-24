import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { useState, useEffect } from "react";
import {
    navBrandClass,
    navLinkClass,
    navLinkActiveClass,
    primaryBtn,
    secondaryBtn,
} from "../styles/common";

const NAV_LINKS = [
    { label: "Home", to: "/", end: true },
];

function Header() {
    const isAuthenticated = useAuth((state) => state.isAuthenticated);
    const user = useAuth((state) => state.currentUser);
    const logout = useAuth((state) => state.logout);
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        setDrawerOpen(false);
        navigate("/login");
    };

    const getProfilePath = () => {
        if (!user) return "/";
        switch (user.role) {
            case "AUTHOR": return "/author-profile";
            case "ADMIN": return "/admin-profile";
            default: return "/user-profile";
        }
    };

    const closeDrawer = () => setDrawerOpen(false);

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/70 backdrop-saturate-150 backdrop-blur-md shadow-sm border-b border-[#e8e8ed]' : 'bg-transparent'}`}>
                <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-20 flex items-center justify-between">

                    <NavLink to="/" className={`${navBrandClass} text-2xl md:text-[2.4rem] font-extrabold tracking-tight text-[#1d1d1f]`}>
                        <span className="text-[#0066cc]">Z</span>enith
                    </NavLink>

                    <div className="hidden md:flex items-center gap-8 ml-auto">

                        {NAV_LINKS.map(({ label, to, end }) => (
                            <NavLink
                                key={label}
                                to={to}
                                end={end}
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors ${isActive
                                        ? 'text-[#0066cc]'
                                        : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}

                        {isAuthenticated && (
                            <NavLink
                                to={getProfilePath()}
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors ${isActive
                                        ? 'text-[#0066cc]'
                                        : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                                    }`
                                }
                            >
                                Articles
                            </NavLink>
                        )}

                        {!isAuthenticated ? (
                            <>
                                <NavLink to="/login">
                                    <button className="text-sm font-medium text-[#1d1d1f] hover:text-[#0066cc] transition-colors px-4 py-2">
                                        Log in
                                    </button>
                                </NavLink>

                                <NavLink to="/register">
                                    <button className={`${primaryBtn} shadow-md shadow-[#0066cc]/20 hover:shadow-lg hover:shadow-[#0066cc]/30 transition-all transform hover:-translate-y-[1px]`}>
                                        Get Started
                                    </button>
                                </NavLink>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="text-sm font-medium text-[#1d1d1f] bg-[#f5f5f7] px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[#0066cc] text-white flex items-center justify-center text-[10px] font-bold">
                                        {user?.firstName?.[0] || "U"}
                                    </span>
                                    {user?.firstName}
                                </div>

                                <button
                                    className="text-sm font-medium text-[#ff3b30] hover:text-[#d92b22] transition-colors px-2 py-2"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        className="md:hidden flex flex-col justify-center items-center gap-1.25 w-8 h-8 cursor-pointer"
                        onClick={() => setDrawerOpen(true)}
                        aria-label="Open menu"
                    >
                        <span
                            className="block h-[1.5px] bg-[#1d1d1f] transition-all duration-200"
                            style={{ width: "22px" }}
                        />
                        <span
                            className="block h-[1.5px] bg-[#1d1d1f] transition-all duration-200"
                            style={{ width: "16px" }}
                        />
                        <span
                            className="block h-[1.5px] bg-[#1d1d1f] transition-all duration-200"
                            style={{ width: "22px" }}
                        />
                    </button>
                </div>
            </nav>

            <div
                onClick={closeDrawer}
                className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden"
                style={{
                    opacity: drawerOpen ? 1 : 0,
                    pointerEvents: drawerOpen ? "auto" : "none",
                }}
            />

            <div
                className="fixed top-0 right-0 h-full w-72 bg-white z-[70] flex flex-col md:hidden"
                style={{
                    transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
                    transition: "transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)",
                    boxShadow: drawerOpen ? "-8px 0 40px rgba(0,0,0,0.08)" : "none",
                }}
            >
                <div className="flex items-center justify-between px-6 h-16 border-b border-[#e8e8ed]">
                    <span className={navBrandClass} style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                        <span className="text-[#0066cc]">Z</span>enith
                    </span>
                    <button
                        onClick={closeDrawer}
                        aria-label="Close menu"
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f7] transition-colors cursor-pointer text-[#6e6e73] hover:text-[#1d1d1f]"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <nav className="flex flex-col px-4 pt-4 gap-1 flex-1">
                    {NAV_LINKS.map(({ label, to, end }) => (
                        <NavLink
                            key={label}
                            to={to}
                            end={end}
                            onClick={closeDrawer}
                            className={({ isActive }) =>
                                `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                                    ? "bg-[#f0f6ff] text-[#0066cc]"
                                    : "text-[#1d1d1f] hover:bg-[#f5f5f7]"
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}

                    {isAuthenticated && (
                        <NavLink
                            to={getProfilePath()}
                            onClick={closeDrawer}
                            className={({ isActive }) =>
                                `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                                    ? "bg-[#f0f6ff] text-[#0066cc]"
                                    : "text-[#1d1d1f] hover:bg-[#f5f5f7]"
                                }`
                            }
                        >
                            Articles
                        </NavLink>
                    )}

                    <div className="border-t border-[#e8e8ed] my-3" />

                    {!isAuthenticated ? (
                        <>
                            <NavLink to="/login" onClick={closeDrawer}>
                                <button className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors cursor-pointer">
                                    Log in
                                </button>
                            </NavLink>
                            <NavLink to="/register" onClick={closeDrawer}>
                                <button className="w-full mt-2 bg-[#0066cc] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#0055aa] transition-colors cursor-pointer shadow-md shadow-[#0066cc]/20">
                                    Get Started
                                </button>
                            </NavLink>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-[#ff3b30] hover:bg-[#ff3b30]/5 transition-colors cursor-pointer mt-auto mb-4"
                        >
                            Logout
                        </button>
                    )}
                </nav>
            </div>
            {/* Spacer for fixed header */}
            <div className="h-16"></div>
        </>
    );
}

export default Header;