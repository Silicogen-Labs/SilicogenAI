import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SubNavbar from "@/components/landing/SubNavbar";
import SilicogenLogo from "@/components/SilicogenLogo";
import { getAllPosts, formatDate, type BlogPost } from "@/lib/blog";

// Fallback gradient covers (cycle by post index)
const COVER_GRADIENTS = [
  "from-[hsl(var(--accent)/0.25)] via-[hsl(var(--accent-secondary)/0.12)] to-transparent",
  "from-[hsl(var(--accent-secondary)/0.25)] via-[hsl(var(--accent)/0.10)] to-transparent",
  "from-indigo-900/40 via-[hsl(var(--accent)/0.08)] to-transparent",
  "from-cyan-900/30 via-[hsl(var(--accent-secondary)/0.10)] to-transparent",
];

// ─── Card Cover ───────────────────────────────────────────────────────────────
function CardCover({ post, idx }: { post: BlogPost; idx: number }) {
  if (post.thumbnail) {
    return (
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <img
          src={post.thumbnail}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle dark scrim so text below doesn't fight the image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/30" />
      </div>
    );
  }

  // Fallback: branded gradient placeholder
  return (
    <div
      className={`relative w-full bg-gradient-to-br ${COVER_GRADIENTS[idx % COVER_GRADIENTS.length]} bg-card`}
      style={{ aspectRatio: "16/9" }}
    >
      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Centre mark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-px w-8 bg-[hsl(var(--accent-secondary)/0.4)]" />
      </div>
    </div>
  );
}

// ─── Post Card (portrait) ─────────────────────────────────────────────────────
function PostCard({ post, idx }: { post: BlogPost; idx: number }) {
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * idx, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigate(`/blog/${post.slug}`)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--accent-secondary)/0.35)] hover:shadow-[0_8px_40px_-8px_hsl(var(--accent-secondary)/0.15)]"
    >
      {/* Cover image */}
      <CardCover post={post} idx={idx} />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--accent-secondary)/0.7)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-base font-bold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-[hsl(var(--accent-secondary))] sm:text-lg">
          {post.title}
        </h2>

        {/* Description */}
        {post.description && (
          <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground/60">
            {post.description}
          </p>
        )}

        {/* Meta footer */}
        <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-muted-foreground/35 border-t border-border/30">
          {post.date && <span>{formatDate(post.date)}</span>}
          <span className="ml-auto">{post.readTime} min read</span>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Blog Index Page ──────────────────────────────────────────────────────────
const Blog = () => {
  const posts = getAllPosts();
  const allTags = ["All", ...Array.from(new Set(posts.flatMap((p) => p.tags)))];
  const [activeTag, setActiveTag] = useState("All");

  const filtered =
    activeTag === "All" ? posts : posts.filter((p) => p.tags.includes(activeTag));

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <SubNavbar />

      <main className="mx-auto w-full max-w-5xl px-5 pb-24 pt-28 sm:px-8">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Blog
          </h1>
          <p className="mt-3 text-muted-foreground/60">
            Engineering notes, hardware deep-dives, and building in public.
          </p>
        </motion.div>

        {/* ── Tag filter ─────────────────────────────────────────────── */}
        {allTags.length > 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-10 flex flex-wrap gap-2"
          >
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 cursor-pointer ${
                  activeTag === tag
                    ? "bg-[hsl(var(--accent-secondary)/0.12)] text-[hsl(var(--accent-secondary))]"
                    : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-[hsl(var(--muted)/0.5)]"
                }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        )}

        {/* ── Grid ───────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center text-sm text-muted-foreground/30"
          >
            No posts for this tag yet.
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, i) => (
              <PostCard key={post.slug} post={post} idx={i} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 px-6 py-8">
        <div className="mx-auto flex max-w-5xl items-center gap-2">
          <SilicogenLogo size={14} showText={false} />
          <span className="text-xs text-muted-foreground/30">© 2026 Silicogen Inc.</span>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
