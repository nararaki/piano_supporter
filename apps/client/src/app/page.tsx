import LoginForm from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">ログイン</h1>
          <p className="mt-2 text-muted-foreground">アカウントにサインインしてください</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
