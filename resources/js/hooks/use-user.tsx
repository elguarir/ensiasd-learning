import { Course, SharedData } from "@/types";
import { usePage } from "@inertiajs/react";

export const useUser = () => {
  const { auth } = usePage<SharedData>().props;

  if (auth.user) {
    return auth.user;
  }

  return null;
};

export const useIsInstructor = (course: Course): boolean => {
  const user = useUser();
  return user?.id === course.instructor_id;
};
