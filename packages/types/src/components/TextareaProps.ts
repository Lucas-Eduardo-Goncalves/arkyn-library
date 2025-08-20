import type { TextareaHTMLAttributes } from "react";

type TextareaProps = {
  label?: string;
  showAsterisk?: boolean;
  errorMessage?: string;

  size?: "md" | "lg";
  variant?: "solid" | "outline";

  name: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name">;

export type { TextareaProps };
