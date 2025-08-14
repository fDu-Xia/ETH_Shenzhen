"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Eye, Send, Upload, X, Globe, Lock, Users, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { ContentPreviewModal } from "@/components/content-preview-modal"
import { RichTextEditor } from "@/components/rich-text-editor"
import { usePathname } from "next/navigation"

interface PublishFormData {
  title: string
  summary: string
  content: string
  coverImage: string
  price: string
  tags: string[]
  category: string
  visibility: "public" | "private" | "subscribers"
  publishType: "immediate" | "scheduled"
  scheduledDate: string
  scheduledTime: string
}

const initialFormData: PublishFormData = {
  title: "",
  summary: "",
  content: "",
  coverImage: "",
  price: "",
  tags: [],
  category: "",
  visibility: "public",
  publishType: "immediate",
  scheduledDate: "",
  scheduledTime: "",
}

const categories = [
  "区块链技术",
  "DeFi协议",
  "NFT艺术",
  "Web3开发",
  "加密货币",
  "智能合约",
  "去中心化应用",
  "元宇宙",
  "DAO治理",
  "其他",
]

const popularTags = [
  "区块链",
  "以太坊",
  "比特币",
  "DeFi",
  "NFT",
  "Web3",
  "智能合约",
  "去中心化",
  "加密货币",
  "元宇宙",
  "DAO",
  "Layer2",
]

export default function PublishPage() {
  const [formData, setFormData] = useState<PublishFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishProgress, setPublishProgress] = useState(0)
  const [newTag, setNewTag] = useState("")
  const [activeTab, setActiveTab] = useState("edit")

  const pathname = usePathname()
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'zh'

  const translations = {
    zh: {
      // Header
      publishContent: "发布内容",
      createAndPublish: "创建并发布您的优质内容",
      saveDraft: "保存草稿",
      saving: "保存中...",
      preview: "预览",
      publishContent: "发布内容",
      publishing: "发布中...",
      
      // Progress
      completionProgress: "完成进度",
      publishingContent: "正在发布内容...",
      
      // Tabs
      editContent: "编辑内容",
      publishSettings: "发布设置",
      
      // Form Fields
      contentTitle: "内容标题",
      titlePlaceholder: "输入吸引人的标题...",
      contentSummary: "内容摘要",
      summaryPlaceholder: "简要描述您的内容...",
      coverImage: "封面图片",
      uploadImage: "上传图片",
      contentBody: "内容正文",
      
      // Price Settings
      priceSetting: "价格设置",
      pricePlaceholder: "0.05",
      
      // Category
      contentCategory: "内容分类",
      selectCategory: "选择分类",
      
      // Tags
      tagSelection: "标签选择",
      addTag: "添加标签...",
      add: "添加",
      popularTags: "热门标签",
      selectedTags: "已选标签",
      
      // Visibility
      visibilitySettings: "可见性设置",
      public: "公开 - 所有人可见",
      subscribers: "订阅者 - 仅订阅者可见",
      private: "私有 - 仅自己可见",
      
      // Publish Type
      publishMethod: "发布方式",
      scheduledPublish: "定时发布",
      publishDate: "发布日期",
      publishTime: "发布时间",
      
      // Publishing Guide
      publishingGuide: "发布指南",
      attractiveTitle: "使用吸引人的标题",
      highQualityCover: "添加高质量封面图",
      clearStructure: "内容结构清晰",
      reasonablePrice: "合理设置价格",
      relevantTags: "选择相关标签",
      estimatedEarnings: "预计收益",
      setPrice: "设置价格",
      basedOnCurrentPrice: "基于当前价格设置",
      
      // Validation Errors
      titleRequired: "请输入内容标题",
      summaryRequired: "请输入内容摘要",
      contentRequired: "请输入内容正文",
      coverImageRequired: "请上传封面图片",
      priceRequired: "请设置有效价格",
      categoryRequired: "请选择内容分类",
      tagsRequired: "请至少添加一个标签",
      dateRequired: "请选择发布日期",
      timeRequired: "请选择发布时间",
      
      // Publishing Steps
      validatingFormat: "验证内容格式...",
      uploadingCover: "上传封面图片...",
      processingContent: "处理内容数据...",
      publishingToBlockchain: "发布到区块链...",
      publishComplete: "发布完成！",
      
      // Content Preview
      contentTitle: "内容标题",
      contentSummary: "内容摘要",
      contentBody: "内容正文",
      uncategorized: "未分类",
    },
    en: {
      // Header
      publishContent: "Publish Content",
      createAndPublish: "Create and publish your quality content",
      saveDraft: "Save Draft",
      saving: "Saving...",
      preview: "Preview",
      publishContent: "Publish Content",
      publishing: "Publishing...",
      
      // Progress
      completionProgress: "Completion Progress",
      publishingContent: "Publishing content...",
      
      // Tabs
      editContent: "Edit Content",
      publishSettings: "Publish Settings",
      
      // Form Fields
      contentTitle: "Content Title",
      titlePlaceholder: "Enter an attractive title...",
      contentSummary: "Content Summary",
      summaryPlaceholder: "Briefly describe your content...",
      coverImage: "Cover Image",
      uploadImage: "Upload Image",
      contentBody: "Content Body",
      
      // Price Settings
      priceSetting: "Price Setting",
      pricePlaceholder: "0.05",
      
      // Category
      contentCategory: "Content Category",
      selectCategory: "Select Category",
      
      // Tags
      tagSelection: "Tag Selection",
      addTag: "Add tag...",
      add: "Add",
      popularTags: "Popular Tags",
      selectedTags: "Selected Tags",
      
      // Visibility
      visibilitySettings: "Visibility Settings",
      public: "Public - Visible to everyone",
      subscribers: "Subscribers - Visible to subscribers only",
      private: "Private - Visible to yourself only",
      
      // Publish Type
      publishMethod: "Publish Method",
      scheduledPublish: "Scheduled Publish",
      publishDate: "Publish Date",
      publishTime: "Publish Time",
      
      // Publishing Guide
      publishingGuide: "Publishing Guide",
      attractiveTitle: "Use attractive titles",
      highQualityCover: "Add high-quality cover images",
      clearStructure: "Clear content structure",
      reasonablePrice: "Set reasonable prices",
      relevantTags: "Choose relevant tags",
      estimatedEarnings: "Estimated Earnings",
      setPrice: "Set Price",
      basedOnCurrentPrice: "Based on current price setting",
      
      // Validation Errors
      titleRequired: "Please enter content title",
      summaryRequired: "Please enter content summary",
      contentRequired: "Please enter content body",
      coverImageRequired: "Please upload cover image",
      priceRequired: "Please set a valid price",
      categoryRequired: "Please select content category",
      tagsRequired: "Please add at least one tag",
      dateRequired: "Please select publish date",
      timeRequired: "Please select publish time",
      
      // Publishing Steps
      validatingFormat: "Validating content format...",
      uploadingCover: "Uploading cover image...",
      processingContent: "Processing content data...",
      publishingToBlockchain: "Publishing to blockchain...",
      publishComplete: "Publish complete!",
      
      // Content Preview
      contentTitle: "Content Title",
      contentSummary: "Content Summary",
      contentBody: "Content Body",
      uncategorized: "Uncategorized",
    }
  }

  const t = translations[currentLocale]

  // Calculate form completion progress
  const calculateProgress = () => {
    const fields = [
      formData.title,
      formData.summary,
      formData.content,
      formData.coverImage,
      formData.price,
      formData.category,
      formData.tags.length > 0,
    ]
    const completed = fields.filter(Boolean).length
    return Math.round((completed / fields.length) * 100)
  }

  const handleInputChange = (field: keyof PublishFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange("tags", [...formData.tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove),
    )
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In real app, upload to storage service
      const imageUrl = URL.createObjectURL(file)
      handleInputChange("coverImage", imageUrl)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = t.titleRequired
    if (!formData.summary.trim()) newErrors.summary = t.summaryRequired
    if (!formData.content.trim()) newErrors.content = t.contentRequired
    if (!formData.coverImage) newErrors.coverImage = t.coverImageRequired
    if (!formData.price || Number.parseFloat(formData.price) <= 0) newErrors.price = t.priceRequired
    if (!formData.category) newErrors.category = t.categoryRequired
    if (formData.tags.length === 0) newErrors.tags = t.tagsRequired

    if (formData.publishType === "scheduled") {
      if (!formData.scheduledDate) newErrors.scheduledDate = t.dateRequired
      if (!formData.scheduledTime) newErrors.scheduledTime = t.timeRequired
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveDraft = async () => {
    setIsDraft(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsDraft(false)
    // Show success message
  }

  const handlePublish = async () => {
    if (!validateForm()) return

    setIsPublishing(true)
    setPublishProgress(0)

    // Simulate publishing process
    const steps = [
      { message: t.validatingFormat, progress: 20 },
      { message: t.uploadingCover, progress: 40 },
      { message: t.processingContent, progress: 60 },
      { message: t.publishingToBlockchain, progress: 80 },
      { message: t.publishComplete, progress: 100 },
    ]

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setPublishProgress(step.progress)
    }

    setIsPublishing(false)
    // Redirect to content page or show success
  }

  const progress = calculateProgress()

  return (
    <div className="min-h-screen bg-[#1E1B3A] text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t.publishContent}</h1>
            <p className="text-gray-400">{t.createAndPublish}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isDraft}
              className="border-purple-500/30 bg-transparent hover:bg-purple-600/20"
            >
              {isDraft ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  {t.saving}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t.saveDraft}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              className="border-purple-500/30 bg-transparent hover:bg-purple-600/20"
            >
              <Eye className="w-4 h-4 mr-2" />
              {t.preview}
            </Button>

            <Button onClick={handlePublish} disabled={isPublishing} className="bg-purple-600 hover:bg-purple-700">
              {isPublishing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  {t.publishing}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {t.publishContent}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="bg-[#2A2550] border-purple-500/20 mb-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{t.completionProgress}</span>
              <span className="text-sm text-purple-400">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Publishing Progress */}
        {isPublishing && (
          <Card className="bg-[#2A2550] border-purple-500/20 mb-8">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-purple-400 animate-spin" />
                <span className="font-medium">{t.publishingContent}</span>
              </div>
              <Progress value={publishProgress} className="h-2" />
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-[#2A2550] border-purple-500/20 mb-6">
                <TabsTrigger value="edit" className="data-[state=active]:bg-purple-600">
                  {t.editContent}
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
                  {t.publishSettings}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="space-y-6">
                {/* Title */}
                <Card className="bg-[#2A2550] border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{t.contentTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder={t.titlePlaceholder}
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="bg-[#1E1B3A] border-purple-500/30"
                    />
                    {errors.title && (
                      <Alert className="mt-2 border-red-500/20 bg-red-500/10">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-400">{errors.title}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Summary */}
                <Card className="bg-[#2A2550] border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{t.contentSummary}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder={t.summaryPlaceholder}
                      value={formData.summary}
                      onChange={(e) => handleInputChange("summary", e.target.value)}
                      className="bg-[#1E1B3A] border-purple-500/30 min-h-[100px]"
                    />
                    {errors.summary && (
                      <Alert className="mt-2 border-red-500/20 bg-red-500/10">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-400">{errors.summary}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Cover Image */}
                <Card className="bg-[#2A2550] border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{t.coverImage}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById("cover-upload")?.click()}
                          className="border-purple-500/30 bg-transparent hover:bg-purple-600/20"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {t.uploadImage}
                        </Button>
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
                            className="w-full max-w-md h-48 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleInputChange("coverImage", "")}
                            className="absolute top-2 right-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      {errors.coverImage && (
                        <Alert className="border-red-500/20 bg-red-500/10">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-red-400">{errors.coverImage}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Rich Text Editor */}
                <Card className="bg-[#2A2550] border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{t.contentBody}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) => handleInputChange("content", content)}
                    />
                    {errors.content && (
                      <Alert className="mt-2 border-red-500/20 bg-red-500/10">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-400">{errors.content}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                {/* Price Setting */}
                <Card className="bg-[#2A2550] border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{t.priceSetting}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.001"
                        placeholder={t.pricePlaceholder}
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        className="bg-[#1E1B3A] border-purple-500/30"
                      />
                      <span className="text-gray-400">ETH</span>
                    </div>
                    {errors.price && (
                      <Alert className="mt-2 border-red-500/20 bg-red-500/10">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-400">{errors.price}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Category */}
                <Card className="bg-[#2A2550] border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{t.contentCategory}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="bg-[#1E1B3A] border-purple-500/30">
                        <SelectValue placeholder={t.selectCategory} />
                      </SelectTrigger>
                      <SelectContent className="bg-[#2A2550] border-purple-500/20">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <Alert className="mt-2 border-red-500/20 bg-red-500/10">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-400">{errors.category}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card className="bg-[#2A2550] border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{t.tagSelection}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder={t.addTag}
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                        className="bg-[#1E1B3A] border-purple-500/30"
                      />
                      <Button onClick={handleAddTag} variant="outline" className="border-purple-500/30 bg-transparent">
                        {t.add}
                      </Button>
                    </div>

                    {/* Popular Tags */}
                    <div>
                      <Label className="text-sm text-gray-400 mb-2 block">{t.popularTags}</Label>
                      <div className="flex flex-wrap gap-2">
                        {popularTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer border-purple-500/30 hover:bg-purple-600/20"
                            onClick={() => {
                              if (!formData.tags.includes(tag)) {
                                handleInputChange("tags", [...formData.tags, tag])
                              }
                            }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Selected Tags */}
                    {formData.tags.length > 0 && (
                      <div>
                        <Label className="text-sm text-gray-400 mb-2 block">{t.selectedTags}</Label>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag) => (
                            <Badge key={tag} className="bg-purple-600 hover:bg-purple-700">
                              {tag}
                              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {errors.tags && (
                      <Alert className="border-red-500/20 bg-red-500/10">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-400">{errors.tags}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Visibility Settings */}
                <Card className="bg-[#2A2550] border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{t.visibilitySettings}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={formData.visibility}
                      onValueChange={(value: "public" | "private" | "subscribers") =>
                        handleInputChange("visibility", value)
                      }
                    >
                      <SelectTrigger className="bg-[#1E1B3A] border-purple-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#2A2550] border-purple-500/20">
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            {t.public}
                          </div>
                        </SelectItem>
                        <SelectItem value="subscribers">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {t.subscribers}
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            {t.private}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Publish Type */}
                <Card className="bg-[#2A2550] border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{t.publishMethod}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.publishType === "scheduled"}
                        onCheckedChange={(checked) =>
                          handleInputChange("publishType", checked ? "scheduled" : "immediate")
                        }
                      />
                      <Label>{t.scheduledPublish}</Label>
                    </div>

                    {formData.publishType === "scheduled" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-400 mb-2 block">{t.publishDate}</Label>
                          <Input
                            type="date"
                            value={formData.scheduledDate}
                            onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                            className="bg-[#1E1B3A] border-purple-500/30"
                          />
                          {errors.scheduledDate && <p className="text-red-400 text-sm mt-1">{errors.scheduledDate}</p>}
                        </div>
                        <div>
                          <Label className="text-sm text-gray-400 mb-2 block">{t.publishTime}</Label>
                          <Input
                            type="time"
                            value={formData.scheduledTime}
                            onChange={(e) => handleInputChange("scheduledTime", e.target.value)}
                            className="bg-[#1E1B3A] border-purple-500/30"
                          />
                          {errors.scheduledTime && <p className="text-red-400 text-sm mt-1">{errors.scheduledTime}</p>}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-[#2A2550] border-purple-500/20 sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">{t.publishingGuide}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">{t.attractiveTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">{t.highQualityCover}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">{t.clearStructure}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">{t.reasonablePrice}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">{t.relevantTags}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-500/20">
                  <h4 className="font-medium mb-2">{t.estimatedEarnings}</h4>
                  <div className="text-2xl font-bold text-green-400">
                    {formData.price ? `${formData.price} ETH` : t.setPrice}
                  </div>
                  <p className="text-sm text-gray-400">{t.basedOnCurrentPrice}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Preview Modal */}
        <ContentPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          content={{
            title: formData.title || t.contentTitle,
            summary: formData.summary || t.contentSummary,
            content: formData.content || t.contentBody,
            coverImage: formData.coverImage || "/placeholder.svg?height=300&width=600",
            price: Number.parseFloat(formData.price) || 0,
            tags: formData.tags,
            category: formData.category || t.uncategorized,
          }}
        />
      </main>
      <Footer />
    </div>
  )
}
