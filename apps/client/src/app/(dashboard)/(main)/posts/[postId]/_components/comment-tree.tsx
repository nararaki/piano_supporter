import type { CommentNode } from "@piano_supporter/common/domains/comment.ts";

interface CommentTreeProps {
    node: CommentNode;
    depth?: number;
}

export function CommentTree({ node, depth = 0 }: CommentTreeProps) {
    const { comment, children } = node;
    const indentStyle = depth > 0 ? { marginLeft: `${depth * 1.5}rem` } : {};

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
                    </div>
                </div>
            </div>
            {children.length > 0 && (
                <div className="mt-3 space-y-3">
                    {children.map((childNode) => (
                        <CommentTree 
                            key={childNode.comment.id} 
                            node={childNode} 
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

