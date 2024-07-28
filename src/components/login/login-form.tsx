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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginType } from "@/lib/types";
import Link from "next/link";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<LoginType>();

  const onSubmit: SubmitHandler<LoginType> = (data) => console.log(data);

  return (
    <Card className="w-full max-w-sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          
          {/* email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-700 text-sm text-left">
                {errors.email?.message}
              </p>
            )}
          </div>

          {/* password */}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                min: {
                  value: 6,
                  message: "Password must be minimum of 6 characters",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-700 text-sm text-left">
                {errors.password?.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            type="submit"
            className="w-full bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:bg-purple-400 dark:text-gray-900 dark:hover:bg-purple-500 dark:focus:ring-purple-400"
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
      </form>
    </Card>
  );
}
