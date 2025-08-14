"use client";

import type React from "react";

import { useState } from "react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Save,
  Eye,
  Send,
  Upload,
  X,
  Globe,
  Lock,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { ContentPreviewModal } from "@/components/content-preview-modal";
import { RichTextEditor } from "@/components/rich-text-editor";

interface PublishFormData {
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  price: string;
  tags: string[];
  category: string;
  visibility: "public" | "private" | "subscribers";
  publishType: "immediate" | "scheduled";
  scheduledDate: string;
  scheduledTime: string;
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
};

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
];

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
];

export default function PublishPage() {
  const [formData, setFormData] = useState<PublishFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [newTag, setNewTag] = useState("");
  const [activeTab, setActiveTab] = useState("edit");

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
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const handleInputChange = (
    field: keyof PublishFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange("tags", [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove)
    );
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
    if (!formData.price || Number.parseFloat(formData.price) <= 0)
      newErrors.price = "请设置有效价格";
    if (!formData.category) newErrors.category = "请选择内容分类";
    if (formData.tags.length === 0) newErrors.tags = "请至少添加一个标签";

    if (formData.publishType === "scheduled") {
      if (!formData.scheduledDate) newErrors.scheduledDate = "请选择发布日期";
      if (!formData.scheduledTime) newErrors.scheduledTime = "请选择发布时间";
    }

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

  return (
    <main className="container mx-auto pt-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">发布内容</h1>
          <p className="text-gray-400">创建并发布您的优质内容</p>
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
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                保存草稿
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
            className="border-purple-500/30 bg-transparent hover:bg-purple-600/20"
          >
            <Eye className="w-4 h-4 mr-2" />
            预览
          </Button>

          <Button
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isPublishing ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                发布中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                发布内容
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card className="bg-[#2A2550] border-purple-500/20 mb-8">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">完成进度</span>
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
              <span className="font-medium">正在发布内容...</span>
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
              <TabsTrigger
                value="edit"
                className="data-[state=active]:bg-purple-600"
              >
                编辑内容
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-purple-600"
              >
                发布设置
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-6">
              {/* Title */}
              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-lg">内容标题</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="输入吸引人的标题..."
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="bg-[#1E1B3A] border-purple-500/30"
                  />
                  {errors.title && (
                    <Alert className="mt-2 border-red-500/20 bg-red-500/10">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-400">
                        {errors.title}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Summary */}
              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-lg">内容摘要</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="简要描述您的内容..."
                    value={formData.summary}
                    onChange={(e) =>
                      handleInputChange("summary", e.target.value)
                    }
                    className="bg-[#1E1B3A] border-purple-500/30 min-h-[100px]"
                  />
                  {errors.summary && (
                    <Alert className="mt-2 border-red-500/20 bg-red-500/10">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-400">
                        {errors.summary}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Cover Image */}
              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-lg">封面图片</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() =>
                          document.getElementById("cover-upload")?.click()
                        }
                        className="border-purple-500/30 bg-transparent hover:bg-purple-600/20"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        上传图片
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
                        <AlertDescription className="text-red-400">
                          {errors.coverImage}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Rich Text Editor */}
              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-lg">内容正文</CardTitle>
                </CardHeader>
                <CardContent>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) =>
                      handleInputChange("content", content)
                    }
                  />
                  {errors.content && (
                    <Alert className="mt-2 border-red-500/20 bg-red-500/10">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-400">
                        {errors.content}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              {/* Price Setting */}
              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-lg">价格设置</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.001"
                      placeholder="0.05"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      className="bg-[#1E1B3A] border-purple-500/30"
                    />
                    <span className="text-gray-400">ETH</span>
                  </div>
                  {errors.price && (
                    <Alert className="mt-2 border-red-500/20 bg-red-500/10">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-400">
                        {errors.price}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Category */}
              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-lg">内容分类</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger className="bg-[#1E1B3A] border-purple-500/30">
                      <SelectValue placeholder="选择分类" />
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
                      <AlertDescription className="text-red-400">
                        {errors.category}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-lg">标签选择</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="添加标签..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                      className="bg-[#1E1B3A] border-purple-500/30"
                    />
                    <Button
                      onClick={handleAddTag}
                      variant="outline"
                      className="border-purple-500/30 bg-transparent"
                    >
                      添加
                    </Button>
                  </div>

                  {/* Popular Tags */}
                  <div>
                    <Label className="text-sm text-gray-400 mb-2 block">
                      热门标签
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer border-purple-500/30 hover:bg-purple-600/20"
                          onClick={() => {
                            if (!formData.tags.includes(tag)) {
                              handleInputChange("tags", [
                                ...formData.tags,
                                tag,
                              ]);
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
                      <Label className="text-sm text-gray-400 mb-2 block">
                        已选标签
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {tag}
                            <X
                              className="w-3 h-3 ml-1 cursor-pointer"
                              onClick={() => handleRemoveTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {errors.tags && (
                    <Alert className="border-red-500/20 bg-red-500/10">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-400">
                        {errors.tags}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Visibility Settings */}
              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-lg">可见性设置</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.visibility}
                    onValueChange={(
                      value: "public" | "private" | "subscribers"
                    ) => handleInputChange("visibility", value)}
                  >
                    <SelectTrigger className="bg-[#1E1B3A] border-purple-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2550] border-purple-500/20">
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          公开 - 所有人可见
                        </div>
                      </SelectItem>
                      <SelectItem value="subscribers">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          订阅者 - 仅订阅者可见
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          私有 - 仅自己可见
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Publish Type */}
              <Card className="bg-[#2A2550] border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-lg">发布方式</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.publishType === "scheduled"}
                      onCheckedChange={(checked) =>
                        handleInputChange(
                          "publishType",
                          checked ? "scheduled" : "immediate"
                        )
                      }
                    />
                    <Label>定时发布</Label>
                  </div>

                  {formData.publishType === "scheduled" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-400 mb-2 block">
                          发布日期
                        </Label>
                        <Input
                          type="date"
                          value={formData.scheduledDate}
                          onChange={(e) =>
                            handleInputChange("scheduledDate", e.target.value)
                          }
                          className="bg-[#1E1B3A] border-purple-500/30"
                        />
                        {errors.scheduledDate && (
                          <p className="text-red-400 text-sm mt-1">
                            {errors.scheduledDate}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm text-gray-400 mb-2 block">
                          发布时间
                        </Label>
                        <Input
                          type="time"
                          value={formData.scheduledTime}
                          onChange={(e) =>
                            handleInputChange("scheduledTime", e.target.value)
                          }
                          className="bg-[#1E1B3A] border-purple-500/30"
                        />
                        {errors.scheduledTime && (
                          <p className="text-red-400 text-sm mt-1">
                            {errors.scheduledTime}
                          </p>
                        )}
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
              <CardTitle className="text-lg">发布指南</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">使用吸引人的标题</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">添加高质量封面图</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">内容结构清晰</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">合理设置价格</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">选择相关标签</span>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-500/20">
                <h4 className="font-medium mb-2">预计收益</h4>
                <div className="text-2xl font-bold text-green-400">
                  {formData.price ? `${formData.price} ETH` : "设置价格"}
                </div>
                <p className="text-sm text-gray-400">基于当前价格设置</p>
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
          title: formData.title || "内容标题",
          summary: formData.summary || "内容摘要",
          content: formData.content || "内容正文",
          coverImage:
            formData.coverImage || "/placeholder.svg?height=300&width=600",
          price: Number.parseFloat(formData.price) || 0,
          tags: formData.tags,
          category: formData.category || "未分类",
        }}
      />
    </main>
  );
}
