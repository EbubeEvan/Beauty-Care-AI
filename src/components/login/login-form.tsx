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
import {FormInput} from "../design-system/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginType, loginSchema } from "@/lib/types";
import { useState } from "react";
import { authenticate } from "@/lib/actions";
import Link from "next/link";
import { z } from "zod";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [errmMsg, setErrMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<LoginType>({ resolver: zodResolver(loginSchema) });

  const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (data) => {
    const user = await authenticate(data);
    user && setErrMsg(user)
  };

  return (
    <Card className="w-full max-w-lg mt-10 min-[1200px]:mt-16 mb-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="text-2xl mb-3">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
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
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            type="submit"
            className="w-full bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:bg-purple-400 dark:text-gray-900 dark:hover:bg-purple-500 dark:focus:ring-purple-400 disabled:opacity-5"
            disabled={isLoading}
          >
            Login
          </Button>
          <p className="mt-5 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-pink-500 dark:text-purple-600 hover:underline"
            >
              {" "}
              Sign up here
            </Link>
          </p>
        </CardFooter>
        {errmMsg && (
          <p className="mt-2 text-sm text-red-500 text-center">{errmMsg}</p>
        )}
      </form>
    </Card>
  );
}
