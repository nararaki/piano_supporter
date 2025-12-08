"use client";
import { useAuth } from "@clerk/nextjs";
import PracticeCard from "./practiceCard"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import { getPractice } from "../action/getPractice";
import { PageHeader } from "@/components/page-header";
import { Plus } from "lucide-react";

const PracticePageContainer = () => {
    const { isLoaded, isSignedIn, userId } = useAuth();
    const [practice, setPractice] = useState<Practice[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded) {
            return;
        }
    
        if (!isSignedIn || !userId) {
            router.push("/sign-in");
            return;
        }
        const fetchPractice = async () => {
            const practiceResult = await getPractice(userId);
            if (!practiceResult.ok) {
                return;
            }
            setPractice(practiceResult.value);
        };
        fetchPractice();
    }, [isLoaded, isSignedIn, userId, router]);

	return (
        <div className="container mx-auto py-8 px-4">
            <PageHeader
                title="練習中楽曲一覧"
                action={{
                    label: "作成する",
                    onClick: () => router.push("/practicing/new"),
                    icon: Plus,
                }}
            />
            <div className="space-y-4">
                {practice.map((practiceItem) => (
                    <PracticeCard key={practiceItem.id} {...practiceItem} />
                ))}
            </div>
        </div>
	);
};

export default PracticePageContainer;