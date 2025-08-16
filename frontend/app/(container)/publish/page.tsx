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
  FileIcon,
  XCircle,
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<string>("");

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, coverImage: "请选择图片文件" }));
        return;
      }
      setSelectedFile(file);
      setUploadResult("");
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      handleInputChange("coverImage", previewUrl);
      // Clear error
      if (errors.coverImage) {
        setErrors(prev => ({ ...prev, coverImage: "" }));
      }
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
    setUploadResult("");

    try {
      // Step 1: Validate content format
      setPublishProgress(20);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 2: Convert cover image to base64 if it's a file
      setPublishProgress(40);
      let coverImageData = formData.coverImage;
      
      if (selectedFile) {
        // Convert image file to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
        reader.readAsDataURL(selectedFile);
        coverImageData = await base64Promise;
      }

      // Step 3: Prepare complete content package
      setPublishProgress(60);
      const contentPackage = {
        metadata: {
          title: formData.title,
          summary: formData.summary,
          timestamp: new Date().toISOString(),
          author: "0x...", // In real app, get from wallet connection
          version: "1.0.0",
          contentType: "article",
        },
        content: {
          body: formData.content,
          coverImage: coverImageData,
        },
      };

      // Step 4: Upload everything to IPFS as a single package
      setPublishProgress(80);
      const packageBlob = new Blob([JSON.stringify(contentPackage, null, 2)], {
        type: "application/json",
      });
      const packageFile = new File([packageBlob], "content-package.json", {
        type: "application/json",
      });

      const formDataToUpload = new FormData();
      formDataToUpload.append("file", packageFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToUpload,
      });

      if (!response.ok) {
        throw new Error("内容上传到 IPFS 失败");
      }

      const result = await response.json();
      
      // Step 5: Complete publishing
      setPublishProgress(100);
      setUploadResult(`发布成功！内容 IPFS Hash: ${result.ipfsHash}`);
      
      // In real app, you would also:
      // 1. Store the IPFS hash on blockchain
      // 2. Update user's content list
      // 3. Redirect to the published content page
      
      // Don't auto-reset, let user decide when to publish new content

    } catch (error) {
      setUploadResult(`发布失败: ${error}`);
      setPublishProgress(0);
    } finally {
      setIsPublishing(false);
    }
  };

  // Add a function to manually reset the form
  const handleNewPublish = () => {
    setFormData(initialFormData);
    setSelectedFile(null);
    setUploadResult("");
    setPublishProgress(0);
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
                disabled={isDraft || uploadResult.includes("发布成功")}
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
                disabled={isPublishing || uploadResult.includes("发布成功")}
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
                <span className="font-medium text-white">
                  {publishProgress <= 20 && "验证内容格式..."}
                  {publishProgress > 20 && publishProgress <= 40 && "处理封面图片..."}
                  {publishProgress > 40 && publishProgress <= 60 && "打包内容数据..."}
                  {publishProgress > 60 && publishProgress <= 80 && "上传到 IPFS..."}
                  {publishProgress > 80 && "发布完成！"}
                </span>
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

        {/* Publish Result */}
        {uploadResult && uploadResult.includes("发布成功") && (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-green-900/20 border border-green-800/50 mb-8"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-green-300 font-medium">
                      {uploadResult}
                    </p>
                    <p className="text-green-400/70 text-sm mt-1">
                      您的内容已永久存储在 IPFS 网络上
                    </p>
                    {uploadResult.includes("Hash:") && (
                      <div className="mt-3 p-2 bg-gray-900/50 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">IPFS Hash:</p>
                        <p className="text-xs text-green-400 font-mono break-all">
                          {uploadResult.split("Hash: ")[1]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <motion.button
                    onClick={handleNewPublish}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-900/50 text-white backdrop-blur-sm transition-colors hover:bg-gray-900/70 flex items-center gap-2 border border-gray-700/50"
                >
                  <ArrowRight className="w-4 h-4" />
                  发布新内容
                </motion.button>
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

              {/* Cover Image with IPFS Upload */}
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
                  {/* File Selection */}
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-gray-400">
                      选择封面图片（将与内容一起上传到 IPFS）
                    </p>
                    
                    <label className="relative cursor-pointer inline-block">
                      <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                      />
                      <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-3 rounded-full bg-gray-900/50 text-gray-200 border border-gray-700 hover:bg-gray-900/70 transition-colors inline-flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        选择图片文件
                      </motion.div>
                    </label>
                  </div>

                  {/* Selected File Info */}
                  {selectedFile && (
                      <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-lg bg-gray-900/50 p-4 border border-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <FileIcon className="w-5 h-5 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-gray-200 font-medium truncate">
                              {selectedFile.name}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <motion.button
                              onClick={() => {
                                setSelectedFile(null);
                                setUploadResult("");
                                handleInputChange("coverImage", "");
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </motion.button>
                        </div>
                        
                        {/* Image Preview */}
                        {formData.coverImage && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4"
                            >
                              <p className="text-sm text-gray-400 mb-2">图片预览：</p>
                              <img
                                  src={formData.coverImage}
                                  alt="Cover preview"
                                  className="w-full h-48 object-cover rounded-lg"
                              />
                            </motion.div>
                        )}
                      </motion.div>
                  )}

                  {/* Upload Result - only show when not publishing */}
                  {uploadResult && !isPublishing && (
                      <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`rounded-lg p-4 ${
                            uploadResult.includes("成功")
                              ? "bg-green-900/20 border border-green-800/50"
                              : "bg-red-900/20 border border-red-800/50"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          {uploadResult.includes("成功") ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                              <XCircle className="w-5 h-5 text-red-400" />
                          )}
                          <p className={`text-sm ${
                            uploadResult.includes("成功")
                              ? "text-green-300"
                              : "text-red-300"
                          }`}>
                            {uploadResult}
                          </p>
                        </div>
                      </motion.div>
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