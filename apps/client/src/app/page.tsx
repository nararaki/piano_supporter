import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Home = async () => {
	const { userId } = await auth();

	if (!userId) {
		redirect("/sign-in");
	}

	// 認証済みユーザーは/homeにリダイレクト
	redirect("/home");
};

export default Home;
