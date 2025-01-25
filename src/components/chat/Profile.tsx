import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog";
import { User } from "lucide-react";
import OnboardingForm from "../onboarding/onboarding-form";

export function Profile() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-3 px-5 py-2">
          <User />
          <p>Profile</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogTitle></DialogTitle>
        <OnboardingForm/>
      </DialogContent>
    </Dialog>
  );
}
