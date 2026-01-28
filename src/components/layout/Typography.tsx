/*use typography for making similer every tags in project*/
import React from "react";

/* Utility */
export const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

/* Types */
export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "paragraph"
  | "muted"
  | "small"
  | "label"
  | "brand";

export type TextColor =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "offWhite"
  | "cream"
  | "white";

export type Weight = "normal" | "medium" | "semibold" | "bold" | "extrabold";
export type Align = "left" | "center" | "right";

/* Styles */
const typographyVariants: Record<TypographyVariant, string> = {
  h1: "scroll-m-20 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight",
  h2: "scroll-m-20 text-3xl md:text-4xl font-semibold tracking-tight",
  h3: "scroll-m-20 text-2xl md:text-3xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl md:text-2xl font-semibold tracking-tight",
  paragraph: "leading-7 text-base md:text-lg",
  muted: "text-sm md:text-base opacity-80",
  small: "text-xs md:text-sm font-medium",
  label: "text-xs md:text-sm font-semibold tracking-wide uppercase",
  brand: "text-2xl md:text-3xl font-bold tracking-wide",
};

const textColors: Record<TextColor, string> = {
  default: "text-slate-800",
  primary: "text-amber-900",
  secondary: "text-stone-700",
  accent: "text-emerald-700",
  offWhite: "text-stone-50",
  cream: "text-amber-50",
  white: "text-white",
};

const weights: Record<Weight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

const aligns: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/* Props */
export interface TypographyProps {
  variant?: TypographyVariant;
  textColor?: TextColor;
  weight?: Weight;
  align?: Align;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

/* Component */
export const Typography: React.FC<TypographyProps> = ({
  variant = "paragraph",
  textColor = "default",
  weight = "normal",
  align = "left",
  as,
  className = "",
  children,
  ...props
}) => {
  const Component =
    as ||
    (variant === "h1"
      ? "h1"
      : variant === "h2"
      ? "h2"
      : variant === "h3"
      ? "h3"
      : variant === "h4"
      ? "h4"
      : variant === "brand" ||
        variant === "small" ||
        variant === "label" ||
        variant === "muted"
      ? "span"
      : "p");

  const classes = cn(
    typographyVariants[variant],
    textColors[textColor],
    weights[weight],
    aligns[align],
    className
  );

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default Typography;
