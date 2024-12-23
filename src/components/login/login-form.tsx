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

import { Spinner } from "../ui/spinner";

export default function LoginForm() {
  const [loading, setLoading] = useState(false)

  const [errMsg, setErrMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({ resolver: zodResolver(loginSchema) });

  const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (data) => {
    try {
      setLoading(true)
      const user = await authenticate(data);
      return user
    } catch (error : any) {
      setErrMsg(error.message)
      setLoading(false)
    }
  };

  return (
    <Card className="w-full max-w-lg -mt-10 min-[1200px]:mt-16 mb-10">
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
            type="password"
          />
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            type="submit"
            className="w-full bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-600 focus:outline-none dark:bg-purple-400 dark:text-gray-900 dark:hover:bg-purple-500"
            disabled={loading}
          >
            { loading ? <Spinner size="small" className="text-gray-200 dark:text-gray-700"/> : "Login"}
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
        {errMsg && (
          <p className="mt-2 text-sm text-red-500 text-center">{errMsg}</p>
        )}
      </form>
    </Card>
  );
}
