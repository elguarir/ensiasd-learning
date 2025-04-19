import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "line" | "ring";
}
export const Spinner = ({
  size = "md",
  variant = "line",
  className,
  ...rest
}: SpinnerProps) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        {
          "size-4": size === "sm",
          "size-10": size === "md",
          "size-12": size === "lg",
        },
        className,
      )}
      {...rest}
    >
      {variant === "line" && (
        <span className="Spinner">
          <span className="SpinnerLeaf" />
          <span className="SpinnerLeaf" />
          <span className="SpinnerLeaf" />
          <span className="SpinnerLeaf" />
          <span className="SpinnerLeaf" />
          <span className="SpinnerLeaf" />
          <span className="SpinnerLeaf" />
          <span className="SpinnerLeaf" />
        </span>
      )}

      {variant === "ring" && (
        <>
          <i
            className={cn(
              "animate-spinner-ease-spin absolute h-full w-full rounded-full border-solid border-t-transparent border-r-transparent border-b-[var(--tw-color)] border-l-transparent",
              {
                "border-[3px]": size === "md" || size === "lg",
              },
              { "border-[1.7px] sm:border-[1.8px]": size === "sm" },
            )}
          />
          <i
            className={cn(
              "animate-spinner-linear-spin absolute h-full w-full rounded-full border-dotted border-t-transparent border-r-transparent border-b-[var(--tw-color)] border-l-transparent opacity-75",
              { "border-[3px]": size === "lg" },
              { "border-[1.7px] sm:border-[1.8px]": size === "sm" },
            )}
          />
        </>
      )}
    </div>
  );
};
