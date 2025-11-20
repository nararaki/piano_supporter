"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";

export const ClientComponent = () => {
	const router = useRouter();
	const { isLoaded, userId, sessionId } = useAuth();
	const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();

	if (!(isLoaded && isUserLoaded)) {
		return <Loader />;
	}

	if (!(isSignedIn && user && userId)) {
		router.push("/sign-in");
	}

	return (
		<div className="flex flex-col gap-2 items-center">
			<p>
				Hello, <span className="font-semibold">{userId}</span> your current
				current active session is{" "}
				<span className="font-semibold">{sessionId}</span>
			</p>
			<p>
				Nice to see you,{" "}
				<span className="font-semibold">
					{user?.firstName} {user?.lastName}
				</span>
				, welcome to the client component!
			</p>
		</div>
	);
};
