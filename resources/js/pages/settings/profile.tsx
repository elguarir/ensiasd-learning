import { type BreadcrumbItem, type SharedData } from "@/types";
import { Transition } from "@headlessui/react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useEffect, useState } from "react";

import DeleteUser from "@/components/delete-user";
import HeadingSmall from "@/components/heading-small";
import InputError from "@/components/input-error";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInitials } from "@/hooks/use-initials";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/layouts/settings/layout";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Profile settings",
    href: "/settings/profile",
  },
];

export default function Profile({
  mustVerifyEmail,
  status,
}: {
  mustVerifyEmail: boolean;
  status?: string;
}) {
  const { auth } = usePage<SharedData>().props;
  const getInitials = useInitials();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { data, setData, post, errors, reset, processing, recentlySuccessful } =
    useForm({
      _method: "patch",
      name: auth.user.name,
      username: auth.user.username,
      email: auth.user.email,
      avatar: null as File | null,
    });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route("profile.update"), {
      method: "patch",
      preserveScroll: true,
      onSuccess: () => {
        reset("avatar");
      },
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profile settings" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Profile information"
            description="Update your name and email address"
          />

          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="avatar">Avatar</Label>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <Avatar className="size-20 border-2">
                    {data.avatar !== null ? (
                      <AvatarImage
                        className="object-cover"
                        src={avatarPreview ?? ""}
                        alt={auth.user.name}
                      />
                    ) : (
                      <AvatarImage
                        className="object-cover"
                        src={auth.user.avatar}
                      />
                    )}
                    <AvatarFallback>
                      {getInitials(auth.user.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <Button type="button" variant={"outline"} asChild>
                    <label htmlFor="avatar">
                      <div>Change avatar</div>
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
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>

                <Input
                  id="name"
                  className="mt-1 block w-full"
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
                  className="mt-1 block w-full"
                  value={data.username}
                  onChange={(e) => setData("username", e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Username"
                />
              </div>

              <InputError
                className="col-span-full mt-2"
                message={errors.name || errors.username}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>

              <Input
                id="email"
                type="email"
                className="mt-1 block w-full"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                required
                autoComplete="username"
                placeholder="Email address"
              />

              <InputError className="mt-2" message={errors.email} />
            </div>

            {mustVerifyEmail && auth.user.email_verified_at === null && (
              <div>
                <p className="mt-2 text-sm text-neutral-800">
                  Your email address is unverified.
                  <Link
                    href={route("verification.send")}
                    method="post"
                    as="button"
                    className="rounded-md text-sm text-neutral-600 underline hover:text-neutral-900 focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
                  >
                    Click here to re-send the verification email.
                  </Link>
                </p>

                {status === "verification-link-sent" && (
                  <div className="mt-2 text-sm font-medium text-green-600">
                    A new verification link has been sent to your email address.
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button disabled={processing}>Save</Button>

              <Transition
                show={recentlySuccessful}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
              >
                <p className="text-sm text-emerald-600">Saved.</p>
              </Transition>
            </div>
          </form>
        </div>

        <DeleteUser />
      </SettingsLayout>
    </AppLayout>
  );
}
