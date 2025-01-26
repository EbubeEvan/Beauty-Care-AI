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
import { FormInput } from "../design-system/FormInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { beautyProfileSchema, beautyProfileType, userType } from "@/lib/types";
import { SelectItems } from "../onboarding/select-items";
import {
  HAIRTYPE,
  HAIRVOLUME,
  STRANDTHICKNESS,
  SKINTYPE,
  SENSITIVITY,
  ALBINO,
  CHEMICALTREATMENTS,
} from "@/lib/data";
import { addBeautyProfile } from "@/lib/actions";
import { Spinner } from "../ui/spinner";
import { CircleUser } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ProfileDetailsProps = {
  user: userType | null;
};

export default function ProfileDetails({
  user,
}: Readonly<ProfileDetailsProps>) {
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<beautyProfileType>({
    resolver: zodResolver(beautyProfileSchema),
    defaultValues: {
      albino: user?.beautyProfile?.albino || "",
      chemicalTreatment: user?.beautyProfile?.chemicalTreatment || "",
      hairColor: user?.beautyProfile?.hairColor || "",
      hairType: user?.beautyProfile?.hairType || "",
      hairVolume: user?.beautyProfile?.hairVolume || "",
      sensitivity: user?.beautyProfile?.sensitivity || "",
      skinColor: user?.beautyProfile?.skinColor || "",
      skinType: user?.beautyProfile?.skinType || "",
      strandThickness: user?.beautyProfile?.strandThickness || "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof beautyProfileSchema>> = async (
    data
  ) => {
    setLoading(true);
    const profile = await addBeautyProfile(data, user?.id || "");
    if (profile?.errors) {
      if (profile?.errors) {
        Object.entries(profile?.errors || {}).forEach(
          ([key, value]: [string, any]) => {
            setError(key as keyof beautyProfileType, { message: value[0] });
          }
        );
      }

      setErrMsg(profile?.message!);
      setLoading(false);
    } else {
        toast({
            variant: "primary",
            description: "Your new beauty profile has been saved!",
          });
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl mt-10 min-[1200px]:mt-16 mb-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <div className="flex justify-center items-center flex-col gap-2 mb-10">
            <CircleUser
              className="text-pink-500 dark:text-purple-400 min-w-24"
              size={80}
            />
            <p className="text-lg">{user?.firstName} {user?.lastName}</p>
            <i>{user?.email}</i>
          </div>
          <CardTitle className="text-2xl mb-3 text-center">Beauty Profile</CardTitle>
          <CardDescription className="text-center">
            Feel free to change your details to suit your current beauty profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <h4 className="text-center font-bold mt-5">Hair Profile</h4>
          {/* Hair Color */}
          <FormInput
            {...register("hairColor")}
            errorText={errors.hairColor?.message!}
            id="hair-color"
            label="hair-color"
            placeholder="Black/Brown etc..."
          />

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
          <h4 className="text-center font-bold mt-5">Skin Profile</h4>

          {/* Skin Color */}
          <FormInput
            {...register("skinColor")}
            errorText={errors.skinColor?.message!}
            id="skin-color"
            label="skin-color"
            placeholder="Dark Brown/Light Brown/ Pale etc..."
          />

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
            className="w-full bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-600 focus:outline-none dark:bg-purple-400 dark:text-gray-900 dark:hover:bg-purple-500"
            disabled={loading}
          >
            {loading ? (
              <Spinner
                size="small"
                className="text-gray-200 dark:text-gray-700"
              />
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
        {errMsg && (
          <p className="mt-2 text-sm text-red-500 text-center">{errMsg}</p>
        )}
      </form>
    </Card>
  );
}
