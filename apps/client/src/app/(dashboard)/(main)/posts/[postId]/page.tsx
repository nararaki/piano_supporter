"use client";

import { useParams } from "next/navigation";
import PostDetail from "./_components/post-detail";

export default function PostPage() {
    const { postId } = useParams();
    
	return (
            <PostDetail postId={postId as string} />
    );
}