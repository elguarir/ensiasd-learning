import { cn } from "@/lib/utils";
import { type LucideProps } from "lucide-react";

interface IconProps extends Omit<LucideProps, "ref"> {
  iconNode: React.ComponentType<LucideProps>;
}

export function Icon({
  iconNode: IconComponent,
  className,
  ...props
}: IconProps) {
  return <IconComponent className={cn("h-4 w-4", className)} {...props} />;
}

export function PasteIcon({ className, ...props }: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={cn("size-10", className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M18 16.25a.75.75 0 0 1 .743.648l.007.102v2A2.75 2.75 0 0 1 16 21.75a.75.75 0 0 1-.102-1.493L16 20.25a1.25 1.25 0 0 0 1.244-1.122L17.25 19v-2a.75.75 0 0 1 .75-.75M3 18.25a.75.75 0 0 1 .743.648L3.75 19c0 .647.492 1.18 1.122 1.244L5 20.25a.75.75 0 0 1 0 1.5A2.75 2.75 0 0 1 2.25 19a.75.75 0 0 1 .75-.75M7 5.25a.75.75 0 0 1 .102 1.493L7 6.75H5a1.25 1.25 0 0 0-1.244 1.122L3.75 8a.75.75 0 0 1-1.5 0 2.75 2.75 0 0 1 2.582-2.745L5 5.25zM3 11.25a.75.75 0 0 1 .743.648L3.75 12v3a.75.75 0 0 1-1.493.102L2.25 15v-3a.75.75 0 0 1 .75-.75M12 20.25a.75.75 0 0 1 .102 1.493L12 21.75H9a.75.75 0 0 1-.102-1.493L9 20.25zM17.89 12.36a.75.75 0 0 1 .102 1.493l-.102.007h-7.78a.75.75 0 0 1-.102-1.493l.102-.007zM17.89 9.25a.75.75 0 0 1 .102 1.493l-.102.007h-7.78a.75.75 0 0 1-.102-1.493l.102-.007zM17.89 6.14a.75.75 0 0 1 .102 1.493l-.102.007h-7.78a.75.75 0 0 1-.102-1.493l.102-.007z"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M9 2.25h10A2.75 2.75 0 0 1 21.75 5v10A2.75 2.75 0 0 1 19 17.75H9A2.75 2.75 0 0 1 6.25 15V5A2.75 2.75 0 0 1 9 2.25m10 1.5H9c-.69 0-1.25.56-1.25 1.25v10c0 .69.56 1.25 1.25 1.25h10c.69 0 1.25-.56 1.25-1.25V5c0-.69-.56-1.25-1.25-1.25"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
