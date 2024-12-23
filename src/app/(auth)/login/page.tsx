import LoginForm from "@/components/login/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Login',
};

export default function page() {
  return (
    <section className="flex flex-col justify-center items-center max-md:px-3 min-h-[100dvh]">
      <div className="w-full flex justify-center">
        <LoginForm />
      </div>
    </section>
  );
}
