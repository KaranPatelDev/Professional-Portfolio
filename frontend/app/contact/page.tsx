import ContactForm from "./ContactForm";
import { PageTitle } from "@/components/ui";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Karan Patel",
  description: "Get in touch about a job opportunity or freelance project.",
};

export default function ContactPage() {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-20">
      <Reveal>
        <PageTitle>Contact</PageTitle>
        <ContactForm />
      </Reveal>
    </div>
  );
}
