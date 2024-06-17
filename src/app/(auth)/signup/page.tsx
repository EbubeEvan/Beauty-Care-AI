import SignupForm from "@/components/signup/signup-form";

export default function page() {
  return (
    <section className="flex flex-col justify-center items-center max-md:px-10 min-h-[100dvh]">
      <div className="">
        <SignupForm />
      </div>
    </section>
  );
}
