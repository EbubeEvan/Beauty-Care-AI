import OnboardingForm from "@/components/onboarding/onboarding-form"
import { Metadata } from "next"
import { auth } from "@/auth";
import { getUser } from "@/auth";

export const metadata: Metadata = {
  title: 'Onboarding',
};

export default async function page () {
  const session = await auth()

  return (
    <section className="flex flex-col justify-center items-center max-md:px-5 min-h-[100dvh]">
      <div className="w-full flex justify-center">
        <OnboardingForm userId={session?.user?.id!}/>
      </div>
    </section>
  )
}
