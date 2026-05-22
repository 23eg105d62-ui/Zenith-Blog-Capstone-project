import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import {
  loadingClass,
  errorClass,
  inputClass,
} from "../styles/common.js";
import { useForm } from "react-hook-form";

function ArticleByID() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (article) return;

    const getArticle = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`http://localhost:4000/user-api/article/${id}`, { withCredentials: true });

        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error);
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id, article]);

  const formatDate = (date) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  // delete & restore article
  const toggleArticleStatus = async () => {
    const newStatus = !article.isArticleActive;

    const confirmMsg = newStatus ? "Restore this article?" : "Delete this article?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axios.patch(
        `http://localhost:4000/author-api/articles/${id}/status`,
        { isArticleActive: newStatus },
        { withCredentials: true },
      );

      console.log("SUCCESS:", res.data);

      setArticle(res.data.payload);

      toast.success(res.data.message);
    } catch (err) {
      console.log("ERROR:", err.response);

      const msg = err.response?.data?.message;

      if (err.response?.status === 400) {
        toast(msg); // already deleted/active case
      } else {
        setError(msg || "Operation failed");
      }
    }
  };

  //edit article
  const editArticle = (articleObj) => {
    navigate("/edit-article", { state: articleObj });
  };

  //post comment by user
  const addComment = async (commentObj) => {
  commentObj.articleId = article._id;

  commentObj.user = user._id;

  console.log(commentObj);
  console.log("Current User:", user);

  try {
    let res = await axios.put(
      "http://localhost:4000/user-api/articles",
      commentObj,
      { withCredentials: true }
    );

    if (res.status === 200) {
      toast.success(res.data.message);
      setArticle(res.data.payload);
      reset();
    }
  } catch (err) {
    console.log(err.response);

    toast.error(
      err.response?.data?.message || "Failed to add comment"
    );
  }
};

  if (loading) return <div className="flex justify-center items-center min-h-screen"><p className={loadingClass}>Loading article...</p></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen"><p className={errorClass}>{error}</p></div>;
  if (!article) return null;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Premium Hero Section */}
      <div className="relative w-full h-[48vh] min-h-[360px] max-h-[520px] rounded-[32px] overflow-hidden bg-[#f5f5f7] flex items-end justify-center mb-20">
        <img 
            src={`https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&q=80`} 
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="relative z-10 w-full max-w-[800px] px-6 pb-16 text-center">
            <span className="inline-block bg-[#0066cc] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-lg">
                {article.category}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-5xl font-extrabold text-white leading-tight mb-8 tracking-tight drop-shadow-md">
                {article.title}
            </h1>
            
            <div className="flex items-center justify-start gap-4 text-white/90">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-sm font-bold shadow-sm">
                        {article.author?.firstName?.[0] || "A"}
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-semibold">{article.author?.firstName || "Author"}</p>
                        <p className="text-xs text-white/70">{formatDate(article.createdAt)}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-[820px] mx-auto px-6">
        {/* Actions for Author */}
        {user?.role === "AUTHOR" && user?.userId === article.author?._id && (
          <div className="flex justify-end gap-3 mb-8">
            <button 
                className="px-4 py-2 bg-[#f5f5f7] text-[#1d1d1f] rounded-lg text-sm font-semibold hover:bg-[#e8e8ed] transition-colors"
                onClick={() => editArticle(article)}
            >
              Edit Article
            </button>
            <button 
                className="px-4 py-2 bg-[#ff3b30]/10 text-[#ff3b30] rounded-lg text-sm font-semibold hover:bg-[#ff3b30]/20 transition-colors"
                onClick={toggleArticleStatus}
            >
              {article.isArticleActive ? "Delete Article" : "Restore Article"}
            </button>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-[28px] shadow-sm border border-[#ececec] p-8 md:p-12 mb-16">
          <div className="prose prose-lg prose-blue max-w-none text-[#1d1d1f] text-[1.08rem] leading-relaxed">
              <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-[#0066cc] first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                  {article.content}
              </p>
          </div>
        </div>

        <div className="border-t border-[#e8e8ed] my-12"></div>

        {/* Comments Section */}
        <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#1d1d1f] mb-8">Responses ({article.comments?.length || 0})</h3>
            
            {/* USER actions */}
            {user?.role === "USER" && (
            <div className="mb-10 bg-[#f5f5f7] p-6 rounded-2xl">
                <form onSubmit={handleSubmit(addComment)} className="flex flex-col gap-4">
                <textarea
                    {...register("comment", { required: true })}
                    className="w-full bg-white border border-[#d2d2d7] rounded-xl p-4 text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-all resize-none min-h-[100px]"
                    placeholder="What are your thoughts?"
                />
                <div className="flex justify-end">
                    <button type="submit" className="bg-[#0066cc] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#0055aa] transition-colors shadow-md">
                        Respond
                    </button>
                </div>
                </form>
            </div>
            )}

            {/* comments list */}
            <div className="space-y-4">
                {article.comments && article.comments.map((comment, idx) => (
                <div key={idx} className="bg-white border border-[#e8e8ed] p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#f0f6ff] text-[#0066cc] flex items-center justify-center text-xs font-bold">
                            {comment.user?.email?.[0]?.toUpperCase() || "U"}
                        </div>
                        <p className="text-sm font-semibold text-[#1d1d1f]">
                            {comment.user?.email || "Anonymous User"}
                        </p>
                    </div>
                    <p className="text-[#333336] leading-relaxed">{comment.comment}</p>
                </div>
                ))}
                
                {(!article.comments || article.comments.length === 0) && (
                    <p className="text-[#6e6e73] text-center py-8">No responses yet. Be the first to share your thoughts!</p>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}

export default ArticleByID;
