import { useAuth } from "../store/authStore";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";

import {
    pageWrapper,
    headingClass,
    mutedText,
    loadingClass,
    errorClass,
    emptyStateClass,
} from "../styles/common.js";

const TOPICS = [
  "All",
  "Artificial Intelligence",
  "Product Design",
  "Web Development",
  "Philosophy",
  "Climate",
  "Space",
  "Health",
  "Economics",
];

function UserProfile() {
    const logout = useAuth((state) => state.logout);
    const currentUser = useAuth((state) => state.currentUser);
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [articles, setArticles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(location.state?.category || "All");

    useEffect(() => {
        const getArticles = async () => {
            setLoading(true);
            try {
                const res = await axios.get("http://localhost:4000/user-api/articles", {
                    withCredentials: true,
                });
                setArticles(res.data.payload);
            } catch (err) {
                setError(err.response?.data?.error || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        getArticles();
    }, []);

    // Update category if location state changes
    useEffect(() => {
        if (location.state?.category) {
            setSelectedCategory(location.state.category);
        }
    }, [location.state]);

    const formatDateIST = (date) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(date).toLocaleDateString("en-US", options);
    };

    const navigateToArticle = (articleObj) => {
        navigate(`/article/${articleObj._id}`, { state: articleObj });
    };

    const filteredArticles = articles.filter(article => 
        selectedCategory === "All" || article.category === selectedCategory
    );

    if (loading) return <p className={loadingClass}>Loading articles...</p>;

    return (
        <div className="max-w-[1000px] mx-auto px-6 py-12">
            {/* ── Profile Header ───────────────────────────── */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-10 border-b border-[#e8e8ed] mb-12 gap-6">
                <div className="flex items-center gap-6">
                    {/* Avatar */}
                    {currentUser?.profileImageUrl ? (
                        <img
                            src={currentUser.profileImageUrl}
                            alt={currentUser.firstName}
                            className="w-20 h-20 rounded-full object-cover border border-[#e8e8ed] shadow-sm"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0066cc] to-[#3388ff] flex items-center justify-center text-white text-3xl font-bold shadow-md">
                            {currentUser?.firstName?.[0]}
                        </div>
                    )}

                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#6e6e73] mb-1.5">
                            Member
                        </p>
                        <h1 className="text-3xl font-extrabold text-[#1d1d1f] tracking-tight">
                            {currentUser?.firstName} {currentUser?.lastName}
                        </h1>
                        <p className="text-[#6e6e73] mt-1">{currentUser?.email}</p>
                    </div>
                </div>
            </div>

            {/* ── Error ────────────────────────────────────── */}
            {error && <p className={errorClass}>{error}</p>}

            {/* ── Category Filter ──────────────────────────── */}
            <div className="mb-10 overflow-x-auto pb-4 hide-scrollbar">
                <div className="flex gap-2">
                    {TOPICS.map(topic => (
                        <button
                            key={topic}
                            onClick={() => setSelectedCategory(topic)}
                            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedCategory === topic 
                                ? "bg-[#1d1d1f] text-white shadow-md" 
                                : "bg-[#f5f5f7] text-[#6e6e73] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]"
                            }`}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Section Title ────────────────────────────── */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
                    {selectedCategory === "All" ? "Latest Articles" : `${selectedCategory} Articles`}
                </h2>
                <span className="text-sm font-medium text-[#6e6e73] bg-[#f5f5f7] px-3 py-1 rounded-full">
                    {filteredArticles.length} results
                </span>
            </div>

            {/* ── Articles Grid ─────────────────────────────── */}
            {filteredArticles.length === 0 ? (
                <div className="py-20 text-center bg-[#f5f5f7] rounded-3xl">
                    <p className="text-lg font-medium text-[#1d1d1f] mb-2">No articles found</p>
                    <p className="text-[#6e6e73]">Try selecting a different topic to explore more content.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredArticles.map((articleObj) => (
                        <div
                            key={articleObj._id}
                            className="group flex flex-col cursor-pointer"
                            onClick={() => navigateToArticle(articleObj)}
                        >
                            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-5 bg-[#f5f5f7]">
                                <img 
                                    src={`https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80`} 
                                    alt={articleObj.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider shadow-sm">
                                        {articleObj.category}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-[#1d1d1f] leading-snug mb-3 group-hover:text-[#0066cc] transition-colors line-clamp-2">
                                    {articleObj.title}
                                </h3>
                                
                                <p className="text-[#6e6e73] text-base leading-relaxed mb-5 line-clamp-3">
                                    {articleObj.content.slice(0, 150)}...
                                </p>

                                <div className="mt-auto flex items-center justify-between border-t border-[#e8e8ed] pt-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#f0f6ff] text-[#0066cc] flex items-center justify-center text-xs font-bold">
                                            {articleObj.author?.firstName?.[0] || "A"}
                                        </div>
                                        <span className="text-sm font-medium text-[#1d1d1f]">
                                            {articleObj.author?.firstName || "Author"}
                                        </span>
                                    </div>
                                    <span className="text-xs text-[#a1a1a6] font-medium uppercase tracking-wider">
                                        {formatDateIST(articleObj.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserProfile;