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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { beautyProfileSchema } from "@/lib/types";
import { useRouter } from "next/navigation";
import { SelectItems } from "./select-items";
import {
  HAIRTYPE,
  HAIRVOLUME,
  STRANDTHICKNESS,
  SKINTYPE,
  SENSITIVITY,
  ALBINO,
  CHEMICALTREATMENTS,
} from "@/lib/data";

export default function OnboardingForm() {
  const router = useRouter();

  // Define the form data type based on the Zod schema
  type BeautyProfile = z.infer<typeof beautyProfileSchema>;

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isLoading },
  } = useForm<BeautyProfile>({
    resolver: zodResolver(beautyProfileSchema),
  });

  const onSubmit: SubmitHandler<BeautyProfile> = (data) => {
    console.log("Form submitted with data:", data);
    router.push("/chat");
  };

  return (
    <Card className="w-full max-w-sm mt-10 min-[1200px]:mt-16 mb-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="text-2xl">Beauty Profile</CardTitle>
          <CardDescription>
            Please fill in the following information to the best of your
            knowledge. Feel free to click or type &quot;No idea&quot; if you
            don&apos;t know the answer.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <h4 className="text-center">Hair Profile</h4>
          {/* Hair Color */}
          <div className="grid gap-2">
            <Label htmlFor="hair-color">Hair Color</Label>
            <Input
              id="hair-color"
              type="text"
              placeholder="Black/Brown etc..."
              {...register("hairColor", { required: "Hair color is required" })}
            />
            {errors.hairColor && (
              <p className="text-red-700 text-sm text-left">
                {errors.hairColor?.message}
              </p>
            )}
          </div>

          {/* Hair Type */}
          <SelectItems
            label="Hair Type"
            name="hairType"
            options={HAIRTYPE}
            optionTitle="name"
            optionValue="value"
            placeholder="Select"
            value={watch().hairType}
            error={!!errors.hairType?.message}
            helperText={errors.hairType?.message}
            onValueChange={(e) => setValue("hairType", e)}
          />

          {/* Strand Thickness */}
          <SelectItems
            label="Strand Thickness"
            name="strandThickness"
            options={STRANDTHICKNESS}
            optionTitle="name"
            optionValue="value"
            placeholder="Select"
            value={watch().strandThickness}
            error={!!errors.strandThickness?.message}
            helperText={errors.strandThickness?.message}
            onValueChange={(e) => setValue("strandThickness", e)}
          />

            {/* Chemical Treatment */}
          <SelectItems
            label="Chemical Treatment"
            name="Chemical Treatment"
            options={CHEMICALTREATMENTS}
            optionTitle="name"
            optionValue="value"
            placeholder="Select"
            value={watch().chemicalTreatment}
            error={!!errors.chemicalTreatment?.message}
            helperText={errors.chemicalTreatment?.message}
            onValueChange={(e) => setValue("chemicalTreatment", e)}
          />

          {/* Hair Volume */}
          <SelectItems
            label="Hair Volume"
            name="hairVolume"
            options={HAIRVOLUME}
            optionTitle="name"
            optionValue="value"
            placeholder="Select"
            value={watch().hairVolume}
            error={!!errors.hairVolume?.message}
            helperText={errors.hairVolume?.message}
            onValueChange={(e) => setValue("hairVolume", e)}
          />

          {/* Skin section */}
          <h4 className="text-center">Skin Profile</h4>

          {/* Skin Color */}
          <div className="grid gap-2">
            <Label htmlFor="skin-color">Skin Color</Label>
            <Input
              id="skin-color"
              type="text"
              placeholder="Dark Brown/Light Brown/ Pale etc..."
              {...register("skinColor", { required: "Skin color is required" })}
            />
            {errors.skinColor && (
              <p className="text-red-700 text-sm text-left">
                {errors.skinColor?.message}
              </p>
            )}
          </div>

          {/* Skin Type */}
          <SelectItems
            label="Skin Type"
            name="skinType"
            options={SKINTYPE}
            optionTitle="name"
            optionValue="value"
            placeholder="Select"
            value={watch().skinType}
            error={!!errors.skinType?.message}
            helperText={errors.skinType?.message}
            onValueChange={(e) => setValue("skinType", e)}
          />

          {/* Sensitivity */}
          <SelectItems
            label="Sensitivity"
            name="sensitivity"
            options={SENSITIVITY}
            optionTitle="name"
            optionValue="value"
            placeholder="Select"
            value={watch().sensitivity}
            error={!!errors.sensitivity?.message}
            helperText={errors.sensitivity?.message}
            onValueChange={(e) => setValue("sensitivity", e)}
          />

          {/* Albino */}
          <SelectItems
            label="Albino"
            name="albino"
            options={ALBINO}
            optionTitle="name"
            optionValue="value"
            placeholder="Select"
            value={watch().albino}
            error={!!errors.albino?.message}
            helperText={errors.albino?.message}
            onValueChange={(e) => setValue("albino", e)}
          />
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            type="submit"
            className="w-full bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:bg-purple-400 dark:text-gray-900 dark:hover:bg-purple-500 dark:focus:ring-purple-400"
            disabled={isLoading}
          >
            Submit
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
