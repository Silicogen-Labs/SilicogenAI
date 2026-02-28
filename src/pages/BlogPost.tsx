import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ArrowLeft, Clock, Calendar, User, Tag, Play } from "lucide-react";
import { motion } from "framer-motion";
import SubNavbar from "@/components/landing/SubNavbar";
import SilicogenLogo from "@/components/SilicogenLogo";
import { getPostBySlug, formatDate } from "@/lib/blog";
import type { Components } from "react-markdown";

// Detect standalone YouTube URLs and render as embeds
const YOUTUBE_RE =
  /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

function extractYouTubeId(url: string): string | null {
  const m = url.match(YOUTUBE_RE);
  if (!m) return null;
  return m[3];
}

/** Terminal-chrome YouTube embed — matches DemoSection styling */
function YouTubeEmbed({ videoId }: { videoId: string }) {
  const [playing, setPlaying] = useState(false);
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white&playsinline=1`;

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-card glow-accent">
      {/* Terminal chrome header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-accent/60" />
        <span className="ml-3 font-mono text-[11px] text-muted-foreground/40">
          youtube · {videoId}
        </span>
      </div>

      {/* Video area */}
      <div className="relative aspect-video w-full bg-background">
        {!playing ? (
          <button
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-4 transition-all"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card/80 backdrop-blur-sm transition-all group-hover:scale-105 group-hover:border-muted-foreground/30">
              <Play className="ml-0.5 h-6 w-6 text-muted-foreground" fill="currentColor" />
            </div>
            <p className="font-mono text-[11px] text-muted-foreground/50">Click to play</p>
          </button>
        ) : (
          <div className="relative h-full w-full overflow-hidden">
            <iframe
              src={src}
              title="YouTube video"
              className="absolute inset-0 h-[calc(100%+120px)] w-full -top-[60px]"
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* Block YouTube top-bar UI */}
            <div className="absolute inset-x-0 top-0 h-16 z-10" />
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4 border-t border-border px-4 py-2 font-mono text-[10px] text-muted-foreground/30">
        <span className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${playing ? "bg-accent/60" : "bg-muted-foreground/30"}`} />
          {playing ? "Playing" : "Ready"}
        </span>
        <span className="ml-auto">YouTube</span>
      </div>
    </div>
  );
}

const markdownComponents: Components = {
  // Standalone YouTube links → terminal-chrome embedded player
  // remark-gfm auto-links bare URLs into <a> tags, so we check both:
  //   1. Plain string child  →  "https://youtu.be/..."
  //   2. Single <a> child    →  <a href="https://youtu.be/...">...</a>
  p({ children }) {
    const kids = Array.isArray(children) ? children : [children];

    if (kids.length === 1) {
      const kid = kids[0];

      // Case 1: bare string URL
      if (typeof kid === "string") {
        const videoId = extractYouTubeId(kid.trim());
        if (videoId) return <YouTubeEmbed videoId={videoId} />;
      }

      // Case 2: remark-gfm wrapped the URL in an <a> tag
      if (kid && typeof kid === "object" && "props" in (kid as object)) {
        const href = (kid as { props?: { href?: string } }).props?.href ?? "";
        const videoId = extractYouTubeId(href);
        if (videoId) return <YouTubeEmbed videoId={videoId} />;
      }
    }

    return <p>{children}</p>;
  },

  // Syntax-highlighted code blocks
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className ?? "");
    const isBlock = !!match;
    if (isBlock) {
      return (
        <SyntaxHighlighter
          style={oneDark}
          language={match![1]}
          PreTag="div"
          customStyle={{
            borderRadius: "0.75rem",
            fontSize: "0.82rem",
            margin: "1.5rem 0",
            border: "1px solid hsl(var(--border)/0.5)",
          }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    }
    return (
      <code
        className="rounded-md bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono text-[0.82em] text-[hsl(var(--accent-secondary))]"
        {...props}
      >
        {children}
      </code>
    );
  },

  // Open external links in new tab
  a({ href, children }) {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-[hsl(var(--accent-secondary))] underline underline-offset-2 hover:opacity-80 transition-opacity"
      >
        {children}
      </a>
    );
  },

  // Styled headings
  h1({ children }) {
    return (
      <h1 className="mb-4 mt-10 text-3xl font-black tracking-tight text-foreground">
        {children}
      </h1>
    );
  },
  h2({ children }) {
    return (
      <h2 className="mb-3 mt-8 text-2xl font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
        {children}
      </h2>
    );
  },
  h3({ children }) {
    return (
      <h3 className="mb-2 mt-6 text-xl font-semibold text-[hsl(var(--accent-secondary))]">
        {children}
      </h3>
    );
  },
  h4({ children }) {
    return (
      <h4 className="mb-2 mt-5 text-lg font-semibold text-foreground">
        {children}
      </h4>
    );
  },

  // Blockquotes
  blockquote({ children }) {
    return (
      <blockquote className="my-6 border-l-4 border-[hsl(var(--accent-secondary)/0.5)] bg-[hsl(var(--accent-secondary)/0.04)] pl-4 pr-4 py-3 rounded-r-lg italic text-muted-foreground">
        {children}
      </blockquote>
    );
  },

  // Horizontal rule
  hr() {
    return <hr className="my-8 border-border/50" />;
  },

  // Tables
  table({ children }) {
    return (
      <div className="my-6 overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-sm">{children}</table>
      </div>
    );
  },
  th({ children }) {
    return (
      <th className="border-b border-border/50 bg-[hsl(var(--muted)/0.5)] px-4 py-2 text-left font-semibold text-foreground">
        {children}
      </th>
    );
  },
  td({ children }) {
    return (
      <td className="border-b border-border/30 px-4 py-2 text-muted-foreground">
        {children}
      </td>
    );
  },
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPostBySlug(slug) : undefined;

  // Redirect to blog index if post not found
  useEffect(() => {
    if (slug && !post) {
      navigate("/blog", { replace: true });
    }
  }, [slug, post, navigate]);

  if (!post) return null;

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-[hsl(var(--accent-secondary)/0.03)] blur-[120px]" />
      </div>

      <SubNavbar />

      <main className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-24 pt-24">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => navigate("/blog")}
          className="mb-10 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[hsl(var(--accent-secondary))]"
        >
          <ArrowLeft size={15} />
          Back to Blog
        </motion.button>

        {/* Article header */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full border border-[hsl(var(--accent-secondary)/0.25)] bg-[hsl(var(--accent-secondary)/0.07)] px-3 py-0.5 text-[11px] font-medium text-[hsl(var(--accent-secondary))]"
                >
                  <Tag size={9} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="mb-5 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>

          {post.description && (
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              {post.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-border/50 pt-5">
            {post.date && (
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDate(post.date)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {post.readTime} min read
            </span>
            <span className="flex items-center gap-1.5">
              <User size={13} />
              {post.author}
            </span>
          </div>
        </motion.header>

        {/* Markdown content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="prose prose-sm sm:prose-base dark:prose-invert max-w-none
            prose-headings:font-black prose-headings:tracking-tight
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-li:text-muted-foreground
            prose-strong:text-foreground prose-strong:font-semibold
            prose-pre:p-0 prose-pre:bg-transparent
            prose-img:rounded-xl prose-img:border prose-img:border-border/50"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {post.content}
          </ReactMarkdown>
        </motion.div>

        {/* Bottom back link */}
        <div className="mt-16 border-t border-border/50 pt-8">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[hsl(var(--accent-secondary))]"
          >
            <ArrowLeft size={15} />
            Back to all posts
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2">
          <SilicogenLogo size={16} showText={false} />
          <span className="text-xs text-muted-foreground/40">© 2026 Silicogen Inc.</span>
        </div>
      </footer>
    </div>
  );
};

export default BlogPost;
