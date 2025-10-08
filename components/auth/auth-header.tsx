"use client"

import { useLanguage } from "@/lib/contexts/language-context"
import Link from "next/link"

export function LoginHeader() {
  const { t } = useLanguage()
  
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold mb-2">{t("welcomeBack")}</h1>
      <p className="text-muted-foreground">{t("signInToContinue")}</p>
    </div>
  )
}

export function SignupHeader() {
  const { t } = useLanguage()
  
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold mb-2">{t("createAccount")}</h1>
      <p className="text-muted-foreground">{t("signUpToGetStarted")}</p>
    </div>
  )
}

export function LoginFooter() {
  const { t } = useLanguage()
  
  return (
    <p className="text-center text-sm text-muted-foreground mt-6">
      {t("dontHaveAccount")}{" "}
      <Link href="/auth/signup" className="text-primary hover:underline font-medium">
        {t("signUpNow")}
      </Link>
    </p>
  )
}

export function SignupFooter() {
  const { t } = useLanguage()
  
  return (
    <p className="text-center text-sm text-muted-foreground mt-6">
      {t("alreadyHaveAccount")}{" "}
      <Link href="/auth/login" className="text-primary hover:underline font-medium">
        {t("signInNow")}
      </Link>
    </p>
  )
}
