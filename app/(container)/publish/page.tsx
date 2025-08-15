"use client";

import type React from "react";

import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Save,
  Eye,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { ContentPreviewModal } from "@/components/content-preview-modal";
import { RichTextEditor } from "@/components/rich-text-editor";
import { motion, useMotionTemplate } from "motion/react";
import { useColorAnimation } from "@/components/color-animation-provider";

interface PublishFormData {
  title: string;
  summary: string;
  content: string;
  coverImage: string;
}

const initialFormData: PublishFormData = {
  title: "",
  summary: "",
  content: "",
  coverImage: "",
};

export default function PublishPage() {
  const [formData, setFormData] = useState<PublishFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);

  // Calculate form completion progress
  const calculateProgress = () => {
    const fields = [
      formData.title,
      formData.summary,
      formData.content,
      formData.coverImage,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const handleInputChange = (
      field: keyof PublishFormData,
      value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In real app, upload to storage service
      const imageUrl = URL.createObjectURL(file);
      handleInputChange("coverImage", imageUrl);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "请输入内容标题";
    if (!formData.summary.trim()) newErrors.summary = "请输入内容摘要";
    if (!formData.content.trim()) newErrors.content = "请输入内容正文";
    if (!formData.coverImage) newErrors.coverImage = "请上传封面图片";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    setIsDraft(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsDraft(false);
    // Show success message
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    setIsPublishing(true);
    setPublishProgress(0);

    // Simulate publishing process
    const steps = [
      { message: "验证内容格式...", progress: 20 },
      { message: "上传封面图片...", progress: 40 },
      { message: "处理内容数据...", progress: 60 },
      { message: "发布到区块链...", progress: 80 },
      { message: "发布完成！", progress: 100 },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPublishProgress(step.progress);
    }

    setIsPublishing(false);
    // Redirect to content page or show success
  };

  const progress = calculateProgress();

  const color = useColorAnimation();
  const border = useMotionTemplate`1px solid ${color}30`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}10`;
  const buttonBorder = useMotionTemplate`1px solid ${color}`;
  const buttonShadow = useMotionTemplate`0px 2px 8px ${color}20`;

  return (
      <main className="container mx-auto pt-8 py-4">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <h1 className="text-3xl md:text-4xl font-light mb-2 text-white">
              创作中心
            </h1>
            <p className="text-gray-400">将您的知识转化为价值</p>
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <motion.button
                onClick={handleSaveDraft}
                disabled={isDraft}
                style={{
                  boxShadow: buttonShadow,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-950/30 text-white backdrop-blur-sm transition-colors hover:bg-gray-950/50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700/50"
            >
              {isDraft ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    保存中...
                  </>
              ) : (
                  <>
                    <Save className="w-4 h-4" />
                    保存草稿
                  </>
              )}
            </motion.button>

            <motion.button
                onClick={() => setIsPreviewOpen(true)}
                style={{
                  boxShadow: buttonShadow,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-950/30 text-white backdrop-blur-sm transition-colors hover:bg-gray-950/50 flex items-center gap-2 border border-gray-700/50"
            >
              <Eye className="w-4 h-4" />
              预览
            </motion.button>

            <motion.button
                onClick={handlePublish}
                disabled={isPublishing}
                style={{
                  border: buttonBorder,
                  boxShadow: buttonShadow,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-950/30 text-white backdrop-blur-sm transition-colors hover:bg-gray-950/50 flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPublishing ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    发布中...
                  </>
              ) : (
                  <>
                    发布内容
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:-rotate-45" />
                  </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
            className="p-4 rounded-2xl bg-gray-950/30 backdrop-blur-sm mb-8"
            style={{ border, boxShadow }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">完成进度</span>
            <motion.span
                className="text-sm font-medium text-white"
                style={{ color }}
            >
              {progress}%
            </motion.span>
          </div>
          <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
            <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: color,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Publishing Progress */}
        {isPublishing && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-gray-950/30 backdrop-blur-sm mb-8"
                style={{ border, boxShadow }}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ color }}
                >
                  <Clock className="w-5 h-5" />
                </motion.div>
                <span className="font-medium text-white">正在发布内容...</span>
              </div>
              <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${publishProgress}%`,
                      background: color,
                    }}
                    animate={{ width: `${publishProgress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Title */}
              <motion.div
                  className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm"
                  style={{ border, boxShadow }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                <h3 className="text-lg font-medium mb-4 text-white">
                  内容标题
                </h3>
                <motion.input
                    placeholder="输入吸引人的标题..."
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 text-white placeholder:text-gray-500 rounded-xl h-10 hover:bg-gray-900/70 transition-all focus:outline-none focus:ring-0"
                    whileFocus={{
                      boxShadow: `0 0 0 2px ${color.get()}40`,
                      borderColor: color.get(),
                    }}
                />
                {errors.title && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                        <p className="text-sm text-red-400">{errors.title}</p>
                      </div>
                    </motion.div>
                )}
              </motion.div>

              {/* Summary */}
              <motion.div
                  className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm"
                  style={{ border, boxShadow }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              >
                <h3 className="text-lg font-medium mb-4 text-white">
                  内容摘要
                </h3>
                <motion.textarea
                    placeholder="简要描述您的内容..."
                    value={formData.summary}
                    onChange={(e) => handleInputChange("summary", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 text-white placeholder:text-gray-500 min-h-[100px] rounded-xl hover:bg-gray-900/70 transition-all resize-none focus:outline-none focus:ring-0"
                    whileFocus={{
                      boxShadow: `0 0 0 2px ${color.get()}40`,
                      borderColor: color.get(),
                    }}
                />
                {errors.summary && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                        <p className="text-sm text-red-400">{errors.summary}</p>
                      </div>
                    </motion.div>
                )}
              </motion.div>

              {/* Cover Image */}
              <motion.div
                  className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm"
                  style={{ border, boxShadow }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              >
                <h3 className="text-lg font-medium mb-4 text-white">
                  封面图片
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <motion.button
                        onClick={() =>
                            document.getElementById("cover-upload")?.click()
                        }
                        style={{ boxShadow: buttonShadow }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-full text-sm font-medium bg-gray-900/50 text-white backdrop-blur-sm transition-colors hover:bg-gray-900/70 flex items-center gap-2 border border-gray-700/50"
                    >
                      <Upload className="w-4 h-4" />
                      上传图片
                    </motion.button>
                    <input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                  </div>

                  {formData.coverImage && (
                      <div className="relative inline-block">
                        <img
                            src={formData.coverImage || "/placeholder.svg"}
                            alt="Cover preview"
                            className="w-full max-w-md h-48 object-cover rounded-xl"
                        />
                        <motion.button
                            onClick={() => handleInputChange("coverImage", "")}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </motion.button>
                      </div>
                  )}

                  {errors.coverImage && (
                      <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                      >
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                          <p className="text-sm text-red-400">
                            {errors.coverImage}
                          </p>
                        </div>
                      </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Rich Text Editor */}
              <motion.div
                  className="p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm"
                  style={{ border, boxShadow }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
              >
                <h3 className="text-lg font-medium mb-4 text-white">
                  内容正文
                </h3>
                <RichTextEditor
                    content={formData.content}
                    onChange={(content) => handleInputChange("content", content)}
                />
                {errors.content && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                        <p className="text-sm text-red-400">{errors.content}</p>
                      </div>
                    </motion.div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
                className="sticky top-4 p-6 rounded-2xl bg-gray-950/30 backdrop-blur-sm"
                style={{ border, boxShadow }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            >
              <h3 className="text-lg font-medium mb-4 text-white">发布指南</h3>

              <div className="space-y-4">
                <div className="space-y-3">
                  {[
                    "使用吸引人的标题",
                    "添加高质量封面图",
                    "内容结构清晰",
                    "保持内容原创性",
                    "优化阅读体验",
                  ].map((item, index) => (
                      <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + index * 0.1, ease: "easeOut" }}
                          className="flex items-center gap-3"
                      >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.0 + index * 0.1, type: "spring", stiffness: 200 }}
                            style={{ color }}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </motion.div>
                        <span className="text-sm text-gray-300">{item}</span>
                      </motion.div>
                  ))}
                </div>

                <motion.div
                    className="pt-4 border-t border-gray-700/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.5, ease: "easeOut" }}
                >
                  <h4 className="font-medium mb-3 text-white">发布提示</h4>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400">
                      • 内容一旦发布将永久存储在区块链上
                    </p>
                    <p className="text-xs text-gray-400">
                      • 请确保内容符合社区规范
                    </p>
                    <p className="text-xs text-gray-400">
                      • 高质量内容将获得更多曝光
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Preview Modal */}
        <ContentPreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            content={{
              title: formData.title || "内容标题",
              summary: formData.summary || "内容摘要",
              content: formData.content || "内容正文",
              coverImage:
                  formData.coverImage || "/placeholder.svg?height=300&width=600",
              price: 0,
              tags: [],
              category: "未分类",
            }}
        />
      </main>
  );
}