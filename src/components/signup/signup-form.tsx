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
import { SignUpType, signUpFormSchema, userErrors } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions";
import { useState } from "react";
import { FormInput } from "../design-system/FormInput";
import { z } from "zod";
import useStore from "@/lib/store/useStore";
import { Spinner } from "../ui/spinner";

export default function SignupForm() {
  const router = useRouter();

  const { setId } = useStore();

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpType>({
    resolver: zodResolver(signUpFormSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof signUpFormSchema>> = async (
    data
  ) => {
    setLoading(true);
    const user = await createUser(data);
    if (user?.errors) {
      Object.entries(user?.errors || {}).forEach(([key, value]: [string, any]) => {
        setError(key as keyof SignUpType, { message: value[0] });
      });    

      setErrMsg(user?.message!);
      setLoading(false);
    } else {
      setId(user?.id!);
      router.push("/signup/onboarding");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mt-10 min-[1200px]:mt-16 mb-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="text-2xl mb-3">Sign Up</CardTitle>
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
            placeholder=""
            type="password"
          />

        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            type="submit"
            className="w-full bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-600 focus:outline-none dark:bg-purple-400 dark:text-gray-900 dark:hover:bg-purple-500"
            disabled={loading}
          >
            {loading ? (
              <Spinner
                size="small"
                className="text-gray-200 dark:text-gray-700"
              />
            ) : (
              "Sign Up"
            )}
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
        {errMsg && (
          <p className="mt-2 text-sm text-red-500 text-center">{errMsg}</p>
        )}
      </form>
    </Card>
  );
}
