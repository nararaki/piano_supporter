import type { CommentNode } from "@piano_supporter/common/domains/comment.ts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createComment } from "../action/createComment";
import { showError, showSuccess } from "@/components/ui/toast";

interface CommentTreeProps {
    node: CommentNode;
    depth?: number;
    postId: string;
    accountId: string;
    onCommentCreated: () => void;
}

export function CommentTree({ node, depth = 0, postId, accountId, onCommentCreated }: CommentTreeProps) {
    const { comment, children } = node;
    const indentStyle = depth > 0 ? { marginLeft: `${depth * 1.5}rem` } : {};
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReply = async () => {
        if (!replyContent.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createComment(postId, accountId, replyContent, comment.id);
            if (result.ok) {
                setReplyContent("");
                setIsReplying(false);
                onCommentCreated();
            } else {
                showError(result.error.message);
            }
        } catch (error) {
            console.error("Failed to create comment:", error);
            showError("コメントの作成に失敗しました");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="border-l-2 border-border pl-4" style={indentStyle}>
            <div className="mb-2">
                <div className="flex items-start gap-2">
                    <div className="flex-1">
                        <p className="text-sm font-medium">アカウントID: {comment.accountId}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {new Date(comment.createdAt).toLocaleString('ja-JP')}
                        </p>
                        <p className="mt-2 whitespace-pre-wrap">{comment.content}</p>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            onClick={() => setIsReplying(!isReplying)}
                        >
                            {isReplying ? "返信をキャンセル" : "返信"}
                        </Button>
                    </div>
                </div>
            </div>

            {isReplying && (
                <div className="mt-3 mb-3 space-y-2">
                    <Label htmlFor={`reply-${comment.id}`}>返信を入力</Label>
                    <Textarea
                        id={`reply-${comment.id}`}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="返信を入力してください"
                        rows={3}
                    />
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleReply}
                            disabled={isSubmitting || !replyContent.trim()}
                        >
                            {isSubmitting ? "送信中..." : "送信"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setIsReplying(false);
                                setReplyContent("");
                            }}
                            disabled={isSubmitting}
                        >
                            キャンセル
                        </Button>
                    </div>
                </div>
            )}

            {children.length > 0 && (
                <div className="mt-3 space-y-3">
                    {children.map((childNode) => (
                        <CommentTree 
                            key={childNode.comment.id} 
                            node={childNode} 
                            depth={depth + 1}
                            postId={postId}
                            accountId={accountId}
                            onCommentCreated={onCommentCreated}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

