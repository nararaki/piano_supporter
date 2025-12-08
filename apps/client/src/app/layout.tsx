import type { Metadata } from "next";
import "./globals.css";
import {
	ClerkProvider,
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from "@clerk/nextjs";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Piano Supporter",
	description: "Piano Supporter",
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
	return (
		<ClerkProvider>
			<html lang="ja">
				<body className="antialiased">
					<header className="fixed top-0 left-0 w-full z-50 h-16 bg-neutral-100 flex items-center">
						<SignedOut>
							<div className="h-fit ml-4 bg-blue-500 w-fit p-2 rounded-md text-white text-sm font-semibold">
								<SignInButton />
							</div>
						</SignedOut>
						<SignedIn>
							<div className="h-fit ml-4 w-fit">
								<UserButton />
							</div>
						</SignedIn>
					</header>
					<main className="min-h-[calc(100dvh-4rem)] max-w-full pt-16">
						{children}
					</main>
				</body>
			</html>
		</ClerkProvider>
	);
};

export default RootLayout;
