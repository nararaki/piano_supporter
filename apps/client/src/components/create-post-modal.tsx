"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, ImageIcon, Video, Smile, MapPin, User, Play, Upload, AlertCircle } from "lucide-react"

interface CreatePostModalProps {
  trigger: React.ReactNode
  onPostCreated: (post: any) => void
}

export default function CreatePostModal({ trigger, onPostCreated }: CreatePostModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fileType, setFileType] = useState<"image" | "video" | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [videoDuration, setVideoDuration] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    const maxSize = 100 * 1024 * 1024 // 100MB
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/mov", "video/avi"]

    if (file.size > maxSize) {
      return "ファイルサイズは100MB以下にしてください"
    }

    if (!allowedImageTypes.includes(file.type) && !allowedVideoTypes.includes(file.type)) {
      return "サポートされていないファイル形式です"
    }

    return null
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const error = validateFile(file)
    if (error) {
      setUploadError(error)
      return
    }

    setUploadError(null)
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    if (file.type.startsWith("video/")) {
      setFileType("video")
      // Get video duration
      const video = document.createElement("video")
      video.src = url
      video.onloadedmetadata = () => {
        setVideoDuration(video.duration)
      }
    } else {
      setFileType("image")
      setVideoDuration(null)
    }
  }

  const simulateUpload = async (): Promise<void> => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    setIsUploading(false)
  }

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    setFileType(null)
    setVideoDuration(null)
    setUploadProgress(0)
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsLoading(true)

    try {
      // Simulate video upload if file is selected
      if (selectedFile) {
        await simulateUpload()
      }

      // Simulate post creation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newPost = {
        id: Date.now(),
        user: "あなた",
        username: "@you",
        avatar: "/diverse-user-avatars.png",
        content: content.trim(),
        video: previewUrl || "/placeholder.svg?height=300&width=400",
        likes: 0,
        comments: 0,
        shares: 0,
        time: "今",
        verified: false,
        fileType: fileType,
        videoDuration: videoDuration,
      }

      onPostCreated(newPost)

      // Reset form
      setContent("")
      removeFile()
      setIsLoading(false)
      setIsOpen(false)
    } catch (error) {
      setUploadError("投稿の作成に失敗しました")
      setIsLoading(false)
    }
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新しい投稿を作成</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="今何をしていますか？"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] resize-none border-none p-0 text-lg placeholder:text-muted-foreground focus-visible:ring-0"
                maxLength={280}
              />

              {previewUrl && (
                <div className="relative rounded-lg overflow-hidden bg-muted">
                  {fileType === "video" ? (
                    <div className="relative">
                      <video ref={videoRef} src={previewUrl} className="w-full h-48 object-cover" controls muted />
                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Play className="h-3 w-3" />
                        {videoDuration && formatDuration(videoDuration)}
                      </div>
                    </div>
                  ) : (
                    <img src={previewUrl || "/placeholder.svg"} alt="プレビュー" className="w-full h-48 object-cover" />
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    アップロード中...
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {uploadError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Label htmlFor="file-upload">
                <Button type="button" variant="ghost" size="sm" className="gap-2" asChild>
                  <span>
                    <ImageIcon className="h-4 w-4" />
                    画像
                  </span>
                </Button>
              </Label>
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Label htmlFor="video-upload">
                <Button type="button" variant="ghost" size="sm" className="gap-2" asChild>
                  <span>
                    <Video className="h-4 w-4" />
                    動画
                  </span>
                </Button>
              </Label>
              <Input id="video-upload" type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />

              <Button type="button" variant="ghost" size="sm" className="gap-2">
                <Smile className="h-4 w-4" />
                絵文字
              </Button>

              <Button type="button" variant="ghost" size="sm" className="gap-2">
                <MapPin className="h-4 w-4" />
                位置情報
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{280 - content.length}</span>
              <Button type="submit" disabled={!content.trim() || isLoading || isUploading} className="px-6">
                {isLoading ? "投稿中..." : "投稿する"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
