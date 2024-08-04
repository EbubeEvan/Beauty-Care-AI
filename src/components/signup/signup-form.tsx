"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { SignUpType } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions";
import useStore from "@/lib/store/useStore";
import { useState } from "react";
import FormInput from "../ui/FormInput";
import { signUpFormSchema } from "@/lib/types";
import { z } from "zod";

export default function SignupForm() {
  const router = useRouter();
  const { setId } = useStore();

  const [errmMsg, setErrMsg] = useState("");

  type SignUp = z.infer<typeof signUpFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<SignUpType>({
    resolver: zodResolver(signUpFormSchema),
  });

  const onSubmit: SubmitHandler<SignUp> = async (data) => {
    const user = await createUser(data);
    if (user.errors) {
      setErrMsg(user.message!);
      return;
    }

    setId(user?.id!);
    router.push("/signup/onboarding");
  };

  return (
    <Card className="w-full max-w-sm mt-10 min-[1200px]:mt-16 mb-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Begin your journey to achieving your beauty goals
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* firstname */}
          <FormInput
            {...register("firstName")}
            errorText={errors.firstName?.message!}
            id="firstName"
            label="firstName"
            placeholder="Jane"
          />

          {/* lastname */}
          <FormInput
            {...register("lastName")}
            errorText={errors.lastName?.message!}
            id="lastName"
            label="lastName"
            placeholder="Doe"
          />

          {/* email */}
          <FormInput
            {...register("email")}
            errorText={errors.email?.message!}
            id="email"
            label="email"
            placeholder="m@example.com"
          />

          {/* password */}
          <FormInput
            {...register("password")}
            errorText={errors.password?.message!}
            id="password"
            label="password"
            placeholder="Doe"
          />

          {/* confirm password */}
          <FormInput
            {...register("confirmPassword")}
            errorText={errors.confirmPassword?.message!}
            id="confirmPassword"
            label="confirmPassword"
            placeholder="Doe"
          />
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            type="submit"
            className="w-full bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:bg-purple-400 dark:text-gray-900 dark:hover:bg-purple-500 dark:focus:ring-purple-400"
            disabled={isLoading}
          >
            Sign up
          </Button>
          <p className="mt-5 text-sm">
            Already have an account?
            <Link
              href="/login"
              className="text-pink-500 dark:text-purple-600 hover:underline"
            >
              {" "}
              Login here
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
