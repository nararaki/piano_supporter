"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { NewPracticeForm } from "./newPracticeForm";

export const NewPracticePageContainer = () => {
	const { isLoaded, isSignedIn, userId } = useAuth();
	const router = useRouter();

	if (!isLoaded) {
		return <div>読み込み中...</div>;
	}

	if (!isSignedIn || !userId) {
		router.push("/sign-in");
		return null;
	}

	return (
		<div className="container mx-auto py-8 px-4">
			<NewPracticeForm />
		</div>
	);
};
