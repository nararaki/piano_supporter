import type { Post } from "@piano_supporter/common/domains/post.ts";
import { useState, useEffect, useCallback } from "react";
import { getPost } from "../action/getPost";
import { showError } from "@/components/ui/toast";
import type { CommentNode } from "@piano_supporter/common/domains/comment.ts";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CommentTree } from "./comment-tree";
import { useAuth } from "@clerk/nextjs";
import { getAccount } from "@/app/(dashboard)/(main)/home/action/getAccount";

export default function PostDetail({ postId }: { postId: string }) {
    const { userId } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Map<string, CommentNode>>(new Map<string, CommentNode>());
    const [accountId, setAccountId] = useState<string | null>(null);

    const fetchPost = useCallback(async () => {
        const result = await getPost(postId);
        if (!result.ok) {
            showError(result.error.message);
            return;
        }
        setPost(result.value.post);
        setComments(result.value.comments);
    }, [postId]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    useEffect(() => {
        const fetchAccount = async () => {
            if (!userId) return;
            const result = await getAccount(userId);
            if (result.ok) {
                setAccountId(result.value.id);
            }
        };
        fetchAccount();
    }, [userId]);

    if (!post) {
        console.log("post not found");
        return <div>読み込み中...</div>;
    }

    // ルートコメント（parentCommentIdがnullのもの）を取得
    const rootComments = Array.from(comments.values()).filter(node => node.comment.parentCommentId === null);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                        {new Date(post.createdAt).toLocaleString('ja-JP')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap">{post.content}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>コメント</CardTitle>
                </CardHeader>
                <CardContent>
                    {rootComments.length === 0 ? (
                        <p className="text-muted-foreground">コメントはまだありません</p>
                    ) : (
                        <div className="space-y-4">
                            {rootComments.map((node) => (
                                <CommentTree 
                                    key={node.comment.id} 
                                    node={node}
                                    postId={postId}
                                    accountId={accountId || ""}
                                    onCommentCreated={fetchPost}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}