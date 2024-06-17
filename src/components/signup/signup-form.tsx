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
import { SignUpType } from "@/lib/types";
import Link from "next/link";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpType>();

  const onSubmit: SubmitHandler<SignUpType> = (data) => console.log(data);

  return (
    <Card className="w-full max-w-sm mt-10 min-[1200px]:mt-16 mb-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Begin your journey to your beauty goals
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">

          {/* firstname */}
          <div className="grid gap-2">
            <Label htmlFor="firstname">First name</Label>
            <Input
              id="firstname"
              type="email"
              placeholder="Jane"
              {...register("firstName", {
                required: "First name is required",
              })}
            />
            {errors.firstName && (
              <p className="text-red-700 text-sm text-left">
                {errors.email?.message}
              </p>
            )}
          </div>

          {/* lastname */}
          <div className="grid gap-2">
            <Label htmlFor="lastname">Last name</Label>
            <Input
              id="lastname"
              type="email"
              placeholder="Doe"
              {...register("lastName", {
                required: "Last name is required",
              })}
            />
            {errors.email && (
              <p className="text-red-700 text-sm text-left">
                {errors.lastName?.message}
              </p>
            )}
          </div>

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

          {/* confirm password */}
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
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
                {errors.confirmPassword?.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            type="submit"
            className="w-full bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:bg-purple-400 dark:text-gray-900 dark:hover:bg-purple-500 dark:focus:ring-purple-400"
          >
            Login
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
