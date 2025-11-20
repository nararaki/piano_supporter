import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ClientComponent } from "@/app/_components/client-component";
import { HomePage } from "@/app/_components/homepage";

const Home = async () => {
	const { userId } = await auth();

	if (!userId) {
		redirect("/sign-in");
	}

	const user = await currentUser();

	return (
		<div className="w-full h-full flex flex-col justify-center items-center mt-4 gap-2">
			<p>
				Hello{" "}
				<span className="font-semibold">
					{user?.firstName}
					{user?.lastName}
				</span>
				, this is a server component
			</p>
			<div>
				<ClientComponent />
				<HomePage />
			</div>
		</div>
	);
};

export default Home;
