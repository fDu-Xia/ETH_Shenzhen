"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react"
import { motion, useMotionTemplate } from "motion/react"
import { useColorAnimation } from "@/components/color-animation-provider"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState("edit")
  const color = useColorAnimation()
  const border = useMotionTemplate`1px solid ${color}30`

  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.getElementById("content-editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)

    onChange(newText)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const formatButtons = [
    { icon: Heading1, action: () => insertMarkdown("# "), label: "标题1" },
    { icon: Heading2, action: () => insertMarkdown("## "), label: "标题2" },
    { icon: Heading3, action: () => insertMarkdown("### "), label: "标题3" },
    { icon: Bold, action: () => insertMarkdown("**", "**"), label: "粗体" },
    { icon: Italic, action: () => insertMarkdown("*", "*"), label: "斜体" },
    { icon: Underline, action: () => insertMarkdown("<u>", "</u>"), label: "下划线" },
    { icon: List, action: () => insertMarkdown("- "), label: "无序列表" },
    { icon: ListOrdered, action: () => insertMarkdown("1. "), label: "有序列表" },
    { icon: Link, action: () => insertMarkdown("[", "](url)"), label: "链接" },
    { icon: ImageIcon, action: () => insertMarkdown("![alt](", ")"), label: "图片" },
    { icon: Code, action: () => insertMarkdown("`", "`"), label: "代码" },
    { icon: Quote, action: () => insertMarkdown("> "), label: "引用" },
  ]

  // Simple markdown to HTML converter for preview
  const markdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/<u>(.*)<\/u>/gim, "<u>$1</u>")
      .replace(/`(.*)`/gim, "<code>$1</code>")
      .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
      .replace(/\[([^\]]+)\]$$([^)]+)$$/gim, '<a href="$2">$1</a>')
      .replace(/!\[([^\]]*)\]$$([^)]+)$$/gim, '<img alt="$1" src="$2" />')
      .replace(/\n/gim, "<br>")
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <motion.div
          className="grid w-full grid-cols-2 bg-gray-950/30 backdrop-blur-sm rounded-full p-1"
          style={{ border }}
        >
          <motion.button
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === "edit"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
            style={{
              background: activeTab === "edit" ? color : "transparent",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            编辑
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === "preview"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
            style={{
              background: activeTab === "preview" ? color : "transparent",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            预览
          </motion.button>
        </motion.div>

        <TabsContent value="edit" className="space-y-4">
          {/* Formatting Toolbar */}
          <motion.div
            className="flex flex-wrap gap-1 p-2 bg-gray-900/50 rounded-xl backdrop-blur-sm"
            style={{ border }}
          >
            {formatButtons.map((button, index) => (
              <motion.button
                key={index}
                onClick={button.action}
                title={button.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="h-8 w-8 p-0 rounded hover:bg-gray-800/50 transition-colors flex items-center justify-center text-gray-400 hover:text-white"
              >
                <button.icon className="w-4 h-4" />
              </motion.button>
            ))}
          </motion.div>

          {/* Editor */}
          <motion.textarea
            id="content-editor"
            placeholder="开始编写您的内容...

支持 Markdown 格式：
# 标题1
## 标题2
**粗体** *斜体*
- 列表项
> 引用
`代码`
[链接](url)
![图片](url)"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-3 bg-gray-900/50 border border-gray-700/50 text-white placeholder:text-gray-500 min-h-[400px] font-mono rounded-xl hover:bg-gray-900/70 transition-all resize-none focus:outline-none focus:ring-0"
            whileFocus={{
              boxShadow: `0 0 0 2px ${color.get()}40`,
              borderColor: color.get(),
            }}
          />
        </TabsContent>

        <TabsContent value="preview">
          <motion.div
            className="bg-gray-900/50 rounded-xl p-4 min-h-[400px] prose prose-invert max-w-none backdrop-blur-sm"
            style={{ border }}
            dangerouslySetInnerHTML={{
              __html: content ? markdownToHtml(content) : "<p class='text-gray-400'>内容预览将在这里显示...</p>",
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
