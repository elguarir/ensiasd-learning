import { cva, type VariantProps } from "class-variance-authority";

const noteStyles = cva(
  [
    "inset-ring-1 inset-ring-current/10 w-full overflow-hidden rounded-lg p-4 sm:text-sm/6",
    "[&_a]:underline data-hovered:[&_a]:underline **:[strong]:font-semibold",
  ],
  {
    variants: {
      intent: {
        default: [
          "border border-neutral-300 bg-neutral-100 text-neutral-800 **:data-[slot=icon]:text-neutral-800 [&_a]:text-neutral-800",
          "dark:border dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:**:data-[slot=icon]:text-neutral-200 dark:[&_a]:text-neutral-200",
        ],
        info: [
          "bg-sky-500/5 text-sky-700 group-data-hovered:bg-sky-500/25 dark:bg-sky-500/10 dark:text-sky-300 dark:group-data-hovered:bg-sky-500/20 dark:**:data-[slot=icon]:text-sky-500 **:data-[slot=icon]:text-sky-500",
        ],
        warning:
          "bg-amber-400/20 text-amber-700 group-data-hovered:bg-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400 dark:group-data-hovered:bg-amber-400/15",
        danger:
          "bg-red-500/15 text-red-700 group-data-hovered:bg-red-500/25 dark:bg-red-500/10 dark:text-red-400 dark:group-data-hovered:bg-red-500/20",
        success: [
          "border-emerald-300/20 bg-emerald-300/50 text-emerald-900 leading-4 **:data-[slot=icon]:text-emerald-500 [&_a]:text-emerald-600",
          "dark:bg-emerald-300/10 dark:text-emerald-200 dark:**:data-[slot=icon]:text-emerald-500 dark:[&_a]:text-emerald-50",
        ],
      },
    },
    defaultVariants: {
      intent: "default",
    },
  },
);

interface NoteProps
  extends React.HtmlHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof noteStyles> {
  indicator?: boolean;
}

const Note = ({
  indicator = true,
  intent = "default",
  className,
  ...props
}: NoteProps) => {
  const iconMap: Record<string, React.ElementType | null> = {
    info: Info,
    warning: TriangleAlert,
    danger: Info,
    success: Check,
    default: null,
  };

  const IconComponent = iconMap[intent as keyof typeof iconMap] || null;

  return (
    <div className={noteStyles({ intent, className })} {...props}>
      <div className="flex grow items-start">
        {IconComponent && indicator && (
          <div className="shrink-0">
            <IconComponent className="mr-3 size-5 rounded-full leading-loose ring-4 ring-current/30" />
          </div>
        )}
        <div className="text-pretty">{props.children}</div>
      </div>
    </div>
  );
};

export { Note };
export type { NoteProps };

// icons

export const Info = (p: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 25"
    data-slot="icon"
    aria-hidden="true"
    {...p}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M2.25 12.75A9.75 9.75 0 0 1 12 3a9.75 9.75 0 0 1 9.75 9.75A9.75 9.75 0 0 1 12 22.5a9.75 9.75 0 0 1-9.75-9.75m8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34zM12 9.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5"
      clipRule="evenodd"
    />
  </svg>
);
export const Check = (p: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    data-slot="icon"
    aria-hidden="true"
    {...p}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m3.58 7.975a.75.75 0 0 0-1.16-.95l-3.976 4.859L9.03 12.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.11-.055z"
      clipRule="evenodd"
    />
  </svg>
);

export const TriangleAlert = (p: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 25"
    data-slot="icon"
    aria-hidden="true"
    {...p}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M8.809 4.731c1.466-2.37 4.913-2.37 6.379 0l6.367 10.297c1.545 2.498-.252 5.722-3.19 5.722H5.632c-2.937 0-4.734-3.224-3.19-5.722L8.81 4.73ZM12 8.75a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 .75-.75m1 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
      clipRule="evenodd"
    />
  </svg>
);
