"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Practice } from "@piano_supporter/common/domains/practice.ts";

const PracticeCard = (practice: Practice) => {
    return (
		<div>
            <Card key={practice.id}>
                <CardHeader>
                    <CardTitle>{practice.music.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>作曲者: {practice.music.composer.name}</p>
                    <p>練習開始日時: {practice.createdAt.toLocaleString()}</p>
                </CardContent>
            </Card>
        </div>
	);
};

export default PracticeCard;