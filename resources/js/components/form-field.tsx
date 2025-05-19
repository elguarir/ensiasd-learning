interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function FormField({ children, ...props }: FormFieldProps) {
  return (
    <div className="flex flex-col space-y-1.5" {...props}>
      {children}
    </div>
  );
}
