"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CreateTaskDialog } from "./createTaskDialog";

const PracticeCard = (practice: Practice) => {
    const router = useRouter();

    const handleCardClick = (e?: React.MouseEvent | React.KeyboardEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        router.push(`/practicing/${practice.id}`);
    };

    const handleViewScore = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/practicing/${practice.id}/score`);
    };

    return (
		<div key={practice.id}>
            <Card className="hover:bg-accent transition-colors">
                <CardHeader>
                    <Button
                        type="button"
                        variant="ghost"
                        className="text-left w-full justify-start p-0 h-auto min-h-[2.5rem] font-semibold hover:bg-transparent"
                        onClick={(e) => handleCardClick(e)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleCardClick(e);
                            }
                        }}
                    >
                        <CardTitle className="pointer-events-none">{practice.music.title}</CardTitle>
                    </Button>
                </CardHeader>
                <CardContent>
                    <p>作曲者: {practice.music.composer.name}</p>
                    <p>曲名: {practice.music.title}</p>
                    <p>最終更新日時: {practice.updatedAt.toLocaleString()}</p>
					<div className="flex gap-2 mt-4">
						<CreateTaskDialog practiceId={practice.id} />
						<Button variant="outline" size="sm" onClick={handleViewScore}>楽譜を閲覧</Button>
					</div>
                </CardContent>
            </Card>
        </div>
	);
};

export default PracticeCard;