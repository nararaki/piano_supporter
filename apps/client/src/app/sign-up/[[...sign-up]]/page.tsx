import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
	return (
		<div className="w-full mt-4 flex justify-center items-center">
			<SignUp fallbackRedirectUrl={"/select-school"} />
		</div>
	);
};

export default SignUpPage;
