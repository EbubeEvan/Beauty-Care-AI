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
import {FormInput} from "../ui/FormInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { beautyProfileSchema } from "@/lib/types";
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
import { beautyProfileType, beautyErrors } from "@/lib/types";
import { addBeautyProfile } from "@/lib/actions";
import useStore from "@/lib/store/useStore";

export default function OnboardingForm() {
  const {id} = useStore()

  const [errmMsg, setErrMsg] = useState("");
  const [serverErrors, setServerErrors] = useState<beautyErrors | null>(null);

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isLoading },
  } = useForm<beautyProfileType>({
    resolver: zodResolver(beautyProfileSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof beautyProfileSchema>> = async (
    data
  ) => {
    const profile = await addBeautyProfile(data, id);
    if (profile?.errors) {
      setErrMsg(profile?.message!);
      setServerErrors(profile?.errors);
    }
  };

  return (
    <Card className="w-full max-w-lg mt-10 min-[1200px]:mt-16 mb-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="text-2xl mb-3">Beauty Profile</CardTitle>
          <CardDescription>
            Please fill in the following information to the best of your
            knowledge. Feel free to click or type &quot;No idea&quot; if you
            don&apos;t know the answer.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <h4 className="text-center">Hair Profile</h4>
          {/* Hair Color */}
          <FormInput
            {...register("hairColor")}
            errorText={errors.hairColor?.message!}
            id="hair-color"
            label="hair-color"
            placeholder="Black/Brown etc..."
          />
          {serverErrors?.hairColor &&
            serverErrors.hairColor.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}

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
          {serverErrors?.hairType &&
            serverErrors.hairType.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}

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
          {serverErrors?.strandThickness &&
            serverErrors.strandThickness.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}

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
          {serverErrors?.chemicalTreatment &&
            serverErrors.chemicalTreatment.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}

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
          {serverErrors?.hairVolume &&
            serverErrors.hairVolume.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}

          {/* Skin section */}
          <h4 className="text-center">Skin Profile</h4>

          {/* Skin Color */}
          <FormInput
            {...register("skinColor")}
            errorText={errors.skinColor?.message!}
            id="skin-color"
            label="skin-color"
            placeholder="Dark Brown/Light Brown/ Pale etc..."
          />
          {serverErrors?.skinColor &&
            serverErrors.skinColor.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}

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
          {serverErrors?.skinType &&
            serverErrors.skinType.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}

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
          {serverErrors?.sensitivity &&
            serverErrors.sensitivity.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}

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
          {serverErrors?.albino &&
            serverErrors.albino.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
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
        {errmMsg && (
          <p className="mt-2 text-sm text-red-500 text-center">{errmMsg}</p>
        )}
      </form>
    </Card>
  );
}
