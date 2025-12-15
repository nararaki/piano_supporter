"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Practice } from "@piano_supporter/common/domains/practice.ts";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const PracticeCard = (practice: Practice) => {
    const router = useRouter();
    const handleViewScore = () => {
        router.push(`/practicing/${practice.id}/score`);
    };
    return (
		<div>
            <Card key={practice.id}>
                <CardHeader>
                    <CardTitle>{practice.music.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>作曲者: {practice.music.composer.name}</p>
                    <p>曲名: {practice.music.title}</p>
                    <p>最終更新日時: {practice.updatedAt.toLocaleString()}</p>
                    <Button variant="outline" size="sm" onClick={handleViewScore}>楽譜を閲覧</Button>
                </CardContent>
            </Card>
        </div>
	);
};

export default PracticeCard;