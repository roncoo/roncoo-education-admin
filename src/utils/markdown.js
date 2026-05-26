import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'
import 'highlight.js/styles/atom-one-dark.css'

// 配置markdown-it实例，启用语法高亮和其他功能
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (error) {
        console.error(error)
        return hljs.highlightAuto(str).value
      }
    }
    return ''
  }
})

hljs.configure({ ignoreUnescapedHTML: true })

/**
 * 预处理Markdown格式，修复AI返回的常见格式问题
 */
export const preprocessMarkdown = (text) => {
  if (!text) return text
  let processed = text
  processed = processed.replace(/^(#{1,6})(?!#)([^#\s])/gm, '$1 $2')
  processed = processed.replace(/^(\s*)([-*+])(?![*\s])(.+)$/gm, '$1$2 $3')
  processed = processed.replace(/^(\s*)(\d+)(?![.\s])(.+)$/gm, '$1$2. $3')
  processed = processed.replace(/^```(\w*)$/gm, '```$1\n')
  processed = processed.replace(/`([^`\n]+)`/g, '`$1`')
  processed = processed.replace(/\*\*([^*\n]+)\*\*/g, '**$1**')
  processed = processed.replace(/\*([^*\n]+)\*/g, '*$1*')
  processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '[$1]($2)')
  processed = processed.replace(/^(\s*)(>)(?![>\s])(.+)$/gm, '$1$2 $3')
  processed = processed.replace(/\|([^|\n]+)\|/g, '| $1 |')
  processed = processed.replace(/([^\n])\n(---{2,}|={3,})\n/g, '$1\n\n$2\n\n')
  processed = processed.replace(/\n{3,}/g, '\n\n')
  return processed
}

/**
 * 安全的Markdown渲染函数
 */
export const safeMarkdownRender = (text) => {
  if (!text || !text.trim()) return ''
  const processedText = preprocessMarkdown(text)
  return md.render(processedText)
}
