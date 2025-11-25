import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
	return (
		<div className="w-full mt-4 flex justify-center items-center">
			<SignUp fallbackRedirectUrl={"/school/select"} />
		</div>
	);
};

export default SignUpPage;
