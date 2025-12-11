"use client";
import { useParams } from "next/navigation";
import { getPractice } from "./action/getPractice";
import { useEffect, useState } from "react";
import { Practice } from "@piano_supporter/common/domains/practice.js";

export default function ScorePage() {
    const { practiceId } = useParams();
    const [practice, setPractice] = useState<Practice | null>(null);
    useEffect(() => {
        const fetchPractice = async () => {
            const result = await getPractice(practiceId as string);
            if (result.ok) {
                setPractice(result.value);
            }
        };
        fetchPractice();
    }, [practiceId]);

    return (
        <div>
            <h1>楽譜</h1>
        </div>
    );
}