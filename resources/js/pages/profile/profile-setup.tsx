import InputError from "@/components/input-error";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Textarea } from "@/components/ui/textarea";
import { useInitials } from "@/hooks/use-initials";
import Layout from "@/layouts/auth-layout";
import type { SharedData } from "@/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useEffect, useState } from "react";

interface Props {}

export default function ProfileSetup(p: Props) {
  const { auth } = usePage<SharedData>().props;
  const getInitials = useInitials();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const steps = ["Profile Information", "About You"];
  const [currentStep, setCurrentStep] = useState(0);

  const { data, setData, post, errors, reset, processing, recentlySuccessful } =
    useForm({
      name: auth.user.name,
      username: auth.user.username,
      email: auth.user.email,
      avatar: null as File | null,
      bio: "",
    });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route("profile.complete"), {
      preserveScroll: true,
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            {/* Profile Picture */}
            <div className="grid gap-2">
              <Label htmlFor="avatar">Profile Picture</Label>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <Avatar className="size-20 border-2">
                    {data.avatar !== null && (
                      <AvatarImage
                        className="object-cover"
                        src={avatarPreview ?? ""}
                        alt={auth.user.name}
                      />
                    )}
                    <AvatarFallback>
                      {getInitials(auth.user.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant={"outline"} asChild>
                    <label htmlFor="avatar">
                      <div>Change picture</div>
                    </label>
                  </Button>
                  {data.avatar !== null && (
                    <Button
                      type="button"
                      variant={"destructive"}
                      onClick={() => setData("avatar", null)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              <Input
                id="avatar"
                name="avatar"
                type="file"
                accept=".png, .jpg, .jpeg"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    setData("avatar", files[0]);
                  }
                }}
              />
              <InputError className="mt-2" message={errors.avatar} />
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={data.username}
                  onChange={(e) => setData("username", e.target.value)}
                  required
                  readOnly={true}
                  autoComplete="username"
                  placeholder="Username"
                />
              </div>
              <InputError
                className="col-span-full mt-2"
                message={errors.name || errors.username}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-8">
            {/* Bio Section */}
            <div className="grid gap-3">
              <Label htmlFor="bio" className="text-base font-semibold">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={data.bio}
                onChange={(e) => setData("bio", e.target.value)}
                placeholder="Tell us a little about yourself (optional)"
                className="min-h-[120px] resize-y"
              />
              <InputError className="mt-1" message={errors.bio} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (data.avatar !== null) {
      const reader = new FileReader();
      reader.onload = (e) =>
        e.target && setAvatarPreview(e.target.result as string);
      reader.readAsDataURL(data.avatar);
    } else {
      setAvatarPreview(null);
    }

    return () => {
      setAvatarPreview(null);
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [data.avatar]);

  return (
    <Layout
      title="Setup your profile"
      description="Enter your details below to setup your profile."
    >
      <Head title="Setup profile" />
      <div>
        <form onSubmit={submit} className="space-y-6">
          <div className="mb-8">
            <Stepper
              value={currentStep}
              onValueChange={setCurrentStep}
              className="w-full"
            >
              {steps.map((step, idx) => (
                <StepperItem key={step} step={idx} className="flex-1">
                  <StepperTrigger className="w-full flex-col items-start justify-center gap-2 rounded">
                    <StepperIndicator asChild className="bg-border h-1 w-full">
                      <span className="sr-only">{idx}</span>
                    </StepperIndicator>
                    <div className="mx-auto space-y-0.5">
                      <StepperTitle>{step}</StepperTitle>
                    </div>
                  </StepperTrigger>
                </StepperItem>
              ))}
            </Stepper>
          </div>

          {/* Display current step content */}
          <div className="py-4">{renderStepContent()}</div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentStep((prev) => prev + 1);
                }}
              >
                Continue
              </Button>
            ) : (
              <Button type="submit" disabled={processing}>
                {processing ? "Saving..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
}
