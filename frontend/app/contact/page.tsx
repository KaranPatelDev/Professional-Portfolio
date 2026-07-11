import ContactForm from "./ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Karan Patel",
  description: "Get in touch about a job opportunity or freelance project.",
};

export default function ContactPage() {
  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      <h1 className="font-heading text-3xl mb-8">Contact</h1>
      <ContactForm />
    </div>
  );
}
