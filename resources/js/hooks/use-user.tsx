import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";

export const useUser = () => {
  const { auth } = usePage<SharedData>().props;

  if (auth.user) {
    return auth.user;
  }

  return null;
};
