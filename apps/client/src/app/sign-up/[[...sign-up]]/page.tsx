import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
	return (
		<div className="w-full mt-4 flex justify-center items-center">
			<SignUp fallbackRedirectUrl={"/home"} />
		</div>
	);
};

export default SignUpPage;
