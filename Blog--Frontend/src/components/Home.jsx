import React, { useState, useEffect, useRef } from "react";
import {
  pageWrapper,
  headingClass,
  bodyText,
  primaryBtn,
  tagClass,
} from "../styles/common";

import bgImage from "../assets/hero.png";

const TOPICS = [
  "Artificial Intelligence",
  "Product Design",
  "Web Development",
  "Philosophy",
  "Climate",
  "Space",
  "Health",
  "Economics",
];

function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}


function Hero({ onBrowseTopics }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-20 sm:pt-24">
      {/* Background Image */}
      <img
        src={bgImage}
        alt="Zenith Blogs Background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: 0.9,
          filter: "brightness(1.02) saturate(1.05)",
          transform: mounted ? "scale(1)" : "scale(1.04)",
          transition: "transform 1.2s ease",
        }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(255,255,255,0.78), rgba(255,255,255,0.50), rgba(255,255,255,0.18))",
          backdropFilter: "blur(1px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-10 w-full">
        <div className="max-w-3xl">

          {/* Subtitle */}
          <p
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.28em",
              color: "#0066cc",
              marginBottom: "24px",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.8s ease 0.2s",
            }}
          >
            Welcome to Zenith Blogs
          </p>

          {/* Heading */}
          <h1
            style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-0.06em",
              color: "#1d1d1f",
              marginBottom: "28px",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s ease 0.35s",
            }}
          >
            Ideas worth
            <br />
            <span style={{ color: "#0066cc" }}>
              thinking about.
            </span>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: "1.18rem",
              lineHeight: 1.8,
              maxWidth: "680px",
              color: "#3a3a3c",
              fontWeight: 400,
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(16px)",
              transition: "all 1s ease 0.5s",
            }}
          >
            In-depth writing on design, technology, science,
            and culture — for curious minds who value clarity
            over noise.
          </p>

          {/* Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 mt-10"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(14px)",
              transition: "all 1s ease 0.65s",
            }}
          >
            <button
              className={`${primaryBtn} w-full sm:w-auto px-6 py-3`}
              onClick={onBrowseTopics}
            >
              Browse Topics
            </button>

            <button
              className="w-full sm:w-auto rounded-full border border-[#d2d2d7] bg-white/75 text-[#1d1d1f] font-semibold px-6 py-3 transition-all duration-200 hover:bg-white"
            >
              Explore Articles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Topics Rail ──────────────────────────────────────
function TopicsRail({ onTopicClick }) {
  const { ref, visible } = useFadeIn();
  const [hovered, setHovered] = useState(null);

  return (
    <div
      id="topics-rail"
      ref={ref}
      className="py-14 border-t border-[#e8e8ed]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.65s ease, transform 0.65s ease",
      }}
    >
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          color: "#1d1d1f",
          letterSpacing: "-0.025em",
          marginBottom: "10px",
        }}
      >
        Explore by Topic
      </h2>
      <p
        className={bodyText}
        style={{ fontSize: "1rem", marginBottom: "28px" }}
      >
        Dive into the subjects that shape our world.
      </p>

      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        {TOPICS.map((topic, i) => (
          <button
            key={topic}
            onMouseEnter={() => setHovered(topic)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onTopicClick(topic)}
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              padding: "9px 20px",
              borderRadius: "9999px",
              border: hovered === topic ? "1px solid #0066cc" : "1px solid #d2d2d7",
              color: hovered === topic ? "#0066cc" : "#1d1d1f",
              background: hovered === topic ? "#f0f6ff" : "white",
              cursor: "pointer",
              transition: "all 0.2s ease",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
              transitionDelay: `${i * 40}ms`,
            }}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Newsletter Banner ────────────────────────────────
function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { ref, visible } = useFadeIn();

  const handleSubmit = () => {
    if (email) setSubmitted(true);
  };

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-[#f5f5f7] px-6 sm:px-10 py-14 flex flex-col lg:flex-row items-center justify-between gap-8 my-14"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <div className="flex flex-col gap-3 max-w-sm">
        <span className={tagClass}>Newsletter</span>
        <h3
          style={{
            fontSize: "1.9rem",
            fontWeight: 700,
            color: "#1d1d1f",
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
          }}
        >
          Every week, something worth reading.
        </h3>
        <p className={bodyText} style={{ fontSize: "0.95rem" }}>
          Curated essays and ideas delivered to your inbox. No noise, no filler.
        </p>
      </div>

      {submitted ? (
        <div
          style={{
            fontSize: "0.875rem",
            color: "#248a3d",
            fontWeight: 500,
            background: "rgba(52,199,89,0.1)",
            border: "1px solid rgba(52,199,89,0.2)",
            borderRadius: "12px",
            padding: "16px 24px",
            animation: "fadeSlideIn 0.4s ease",
          }}
        >
          ✓ You're on the list. Check your inbox.
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="min-w-0 w-full bg-white border border-[#d2d2d7] rounded-2xl px-4 py-3 text-[#1d1d1f] text-sm outline-none transition focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/10"
          />
          <button className={`${primaryBtn} w-full sm:w-auto`} onClick={handleSubmit}>
            Subscribe
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Global keyframe ──────────────────────────────────
const globalStyle = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();

  const handleBrowseTopics = () => {
    document.getElementById("topics-rail")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTopicClick = (topic) => {
    navigate('/user-profile', { state: { category: topic } });
  };

  return (
    <>
      <style>{globalStyle}</style>
      <div className={pageWrapper}>
        <Hero onBrowseTopics={handleBrowseTopics} />
        <TopicsRail onTopicClick={handleTopicClick} />
        <NewsletterBanner />
      </div>
    </>
  );
}

export default Home;