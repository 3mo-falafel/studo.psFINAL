import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SignupForm } from "@/components/auth/signup-form"
import { SignupHeader, SignupFooter } from "@/components/auth/auth-header"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <SignupHeader />
            <SignupForm />
            <SignupFooter />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
