import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ContactContent } from "@/components/contact/contact-content"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-5xl">
          <ContactContent />
        </div>
      </main>

      <Footer />
    </div>
  )
}
