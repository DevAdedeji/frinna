import * as React from "react";
import { href, Link } from "react-router-dom";

type ButtonBaseProps = {
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary";
}

type ButtonAsButton = ButtonBaseProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & { href?: never }

type ButtonAsLink = ButtonBaseProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & { href?: string }

type ButtonProps = ButtonAsButton | ButtonAsLink;

const getVariantStyles = (variant: ButtonProps['variant']) => {
    switch (variant) {
        case "primary":
            return "bg-sky-blue text-white"
        case "secondary":
            return "bg-midnight text-white"
        default:
            return "bg-sky-blue text-white"
    }
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(({ className, children, variant = "primary", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md px-4 py-2 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantStyles = getVariantStyles(variant);
    const combinedStyles = `${baseStyles} ${variantStyles} ${className || ''}`;
    if ("href" in props && props.href) {
        return (
            <Link className={combinedStyles} to={props.href} ref={ref as React.Ref<HTMLAnchorElement>} {...(props as Omit<ButtonAsLink, "className">)}>
                {children}
            </Link>
        )
    }
    return (
        <button className={combinedStyles} ref={ref as React.Ref<HTMLButtonElement>} {...(props as Omit<ButtonAsButton, "className">)}> {children} </button>
    )
})

export default Button;