// Eager-load all markdown files in src/Blog/ as raw strings
const rawFiles = import.meta.glob('../Blog/*.md', { query: '?raw', import: 'default', eager: true })

export interface BlogPost {
  slug: string
  title: string
  date: string        // YYYY-MM-DD
  description: string
  author: string
  tags: string[]
  content: string
  readTime: number    // minutes, estimated at 200 wpm
  thumbnail: string | null  // YouTube thumbnail or frontmatter image URL
}

/**
 * Browser-safe YAML frontmatter parser.
 * Supports: string values (quoted or unquoted), string arrays.
 */
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { data: {}, content: raw }

  const content = raw.slice(match[0].length)
  const data: Record<string, unknown> = {}

  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim()
    const val = line.slice(colonIdx + 1).trim()
    if (!key) continue

    if (val.startsWith('[')) {
      // Array: ["tag1", "tag2"] or [tag1, tag2]
      data[key] = val
        .slice(1, val.lastIndexOf(']'))
        .split(',')
        .map((v) => v.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else {
      // Scalar string — strip surrounding quotes
      data[key] = val.replace(/^["']|["']$/g, '')
    }
  }

  return { data, content }
}

/**
 * Parse filename of the form YYYY-MM-DD_Post_Title_Here.md
 * Returns { date, slug } derived from the filename.
 * Frontmatter fields override these if present.
 */
function parseFilename(path: string): { date: string; slug: string } {
  const filename = path.split('/').pop()!.replace(/\.md$/, '')
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})_(.+)$/)
  if (match) {
    return {
      date: match[1],
      slug: match[2].toLowerCase().replace(/_/g, '-'),
    }
  }
  return {
    date: '',
    slug: filename.toLowerCase().replace(/_/g, '-'),
  }
}

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

const YOUTUBE_RE = /https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/

/** Extract first YouTube video ID from content and return its thumbnail URL */
function extractThumbnail(content: string, frontmatterImage?: string): string | null {
  if (frontmatterImage) return frontmatterImage
  const m = content.match(YOUTUBE_RE)
  if (m) return `https://img.youtube.com/vi/${m[3]}/hqdefault.jpg`
  return null
}

export function getAllPosts(): BlogPost[] {
  return Object.entries(rawFiles)
    .map(([path, raw]) => {
      const { data, content } = parseFrontmatter(raw as string)
      const { date: filenameDate, slug: filenameSlug } = parseFilename(path)
      return {
        slug: (data.slug as string | undefined) ?? filenameSlug,
        title: (data.title as string | undefined) ?? '',
        date: (data.date as string | undefined) ?? filenameDate,
        description: (data.description as string | undefined) ?? '',
        author: (data.author as string | undefined) ?? 'SilicogenAI',
        tags: (data.tags as string[] | undefined) ?? [],
        content,
        readTime: estimateReadTime(content),
        thumbnail: extractThumbnail(content, data.image as string | undefined),
      }
    })
    .sort((a, b) => {
      if (!a.date && !b.date) return 0
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
