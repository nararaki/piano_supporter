import type { Post } from "@piano_supporter/common/domains/post.ts";
import { useState, useEffect } from "react";
import { getPost } from "../action/getPost";
import { showError } from "@/components/ui/toast";
import type { CommentNode } from "@piano_supporter/common/domains/comment.ts";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CommentTree } from "./comment-tree";

export default function PostDetail({ postId }: { postId: string }) {
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Map<string, CommentNode>>(new Map<string, CommentNode>());
    useEffect(() => {
        const fetchPost = async () => {
            const result = await getPost(postId);
            if (!result.ok) {
                showError(result.error.message);
                return;
            }
            setPost(result.value.post);
            setComments(result.value.comments);
        };
        fetchPost();
    }, [postId]);

    if (!post) {
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
                                <CommentTree key={node.comment.id} node={node} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}