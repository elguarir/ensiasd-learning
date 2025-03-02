import InputError from "@/components/input-error";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Plus, X } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";

interface Props {}

export default function ProfileSetup(p: Props) {
  const { auth } = usePage<SharedData>().props;
  const getInitials = useInitials();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [expertiseInput, setExpertiseInput] = useState("");

  const { data, setData, post, errors, reset, processing, recentlySuccessful } =
    useForm({
      name: auth.user.name,
      username: auth.user.username,
      email: auth.user.email,
      avatar: null as File | null,
      accountType: "student",
      bio: "",
      expertise_areas: [] as string[],
      social_links: {
        linkedin: "",
        twitter: "",
        github: "",
        website: "",
      },
    });

  const accountTypes = [
    { value: "student", label: "Student" },
    { value: "instructor", label: "Instructor" },
  ];

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route("profile.complete"), {
      preserveScroll: true,
    });
  };

  const addExpertiseArea = () => {
    if (!expertiseInput.trim()) return;
    if (data.expertise_areas.length >= 5) return;
    if (data.expertise_areas.includes(expertiseInput.trim())) return;

    setData("expertise_areas", [
      ...data.expertise_areas,
      expertiseInput.trim(),
    ]);
    setExpertiseInput("");
  };

  const removeExpertiseArea = (index: number) => {
    setData(
      "expertise_areas",
      data.expertise_areas.filter((_, i) => i !== index),
    );
  };

  const handleSocialLinkChange = (key: string, value: string) => {
    setData("social_links", {
      ...data.social_links,
      [key]: value,
    });
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

  const steps = ["Profile Information", "Additional Settings"];

  const getNestedError = (path: string) => {
    if (errors[path as keyof typeof errors]) {
      return errors[path as keyof typeof errors];
    }

    return undefined;
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

            {/* Account Type */}
            <div className="grid gap-3">
              <Label htmlFor="account-type">Account Type</Label>
              <RadioGroup
                className="grid w-full grid-cols-2 gap-2"
                defaultValue={data.accountType}
                onValueChange={(value) => setData("accountType", value)}
              >
                {accountTypes.map((item) => (
                  <div
                    key={item.value}
                    className="border-input has-data-[state=checked]:border-ring relative flex flex-col items-start gap-4 rounded-md border px-3 py-4 shadow-xs outline-none"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        id={item.value}
                        value={item.value}
                        className="after:absolute after:inset-0"
                      />
                      <Label htmlFor={item.value}>{item.label}</Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
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
                {data.accountType === "instructor" && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </Label>
              <Textarea
                id="bio"
                value={data.bio}
                onChange={(e) => setData("bio", e.target.value)}
                placeholder={
                  data.accountType === "instructor"
                    ? "Share your professional experience and teaching philosophy (min 100 characters)"
                    : "Tell us a little about yourself (optional)"
                }
                className="min-h-[120px] resize-y"
              />
              {data.accountType === "instructor" && (
                <p className="text-muted-foreground text-xs">
                  {data.bio.length}/1000 characters (minimum 100 characters
                  required)
                </p>
              )}
              <InputError className="mt-1" message={errors.bio} />
            </div>

            {/* Instructor-specific fields */}
            {data.accountType === "instructor" && (
              <>
                {/* Expertise Areas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Areas of Expertise</CardTitle>
                    <CardDescription>
                      Add up to 5 areas where you have expertise (required)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input
                        value={expertiseInput}
                        onChange={(e) => setExpertiseInput(e.target.value)}
                        placeholder="Enter an area of expertise"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addExpertiseArea();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addExpertiseArea}
                        disabled={
                          !expertiseInput.trim() ||
                          data.expertise_areas.length >= 5 ||
                          data.expertise_areas.includes(expertiseInput.trim())
                        }
                      >
                        <Plus className="mr-1 size-4" />
                        Add
                      </Button>
                    </div>

                    {data.expertise_areas.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {data.expertise_areas.map((area, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1.5 text-sm font-normal"
                          >
                            {area}
                            <button
                              type="button"
                              onClick={() => removeExpertiseArea(index)}
                              className="text-muted-foreground hover:text-foreground ml-2"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground pt-2 text-sm italic">
                        No expertise areas added yet
                      </p>
                    )}
                    <InputError message={errors["expertise_areas"]} />
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card>
                  <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                    <CardDescription>
                      Connect your professional profiles (optional)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={data.social_links.linkedin}
                        onChange={(e) =>
                          handleSocialLinkChange("linkedin", e.target.value)
                        }
                      />
                      <InputError
                        message={getNestedError("social_links.linkedin")}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        placeholder="https://github.com/yourusername"
                        value={data.social_links.github}
                        onChange={(e) =>
                          handleSocialLinkChange("github", e.target.value)
                        }
                      />
                      <InputError
                        message={getNestedError("social_links.github")}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        placeholder="https://twitter.com/yourusername"
                        value={data.social_links.twitter}
                        onChange={(e) =>
                          handleSocialLinkChange("twitter", e.target.value)
                        }
                      />
                      <InputError
                        message={getNestedError("social_links.twitter")}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="website">Personal Website</Label>
                      <Input
                        id="website"
                        placeholder="https://yourwebsite.com"
                        value={data.social_links.website}
                        onChange={(e) =>
                          handleSocialLinkChange("website", e.target.value)
                        }
                      />
                      <InputError
                        message={getNestedError("social_links.website")}
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

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
