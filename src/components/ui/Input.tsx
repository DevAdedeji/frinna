import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string,
    error?: string,
    ringColor?: string,
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, id, ringColor, error, ...props }, ref) => {
    const inputId = id || React.useId();
    const baseStyles = "w-full h-full rounded-[5px] outline-none py-[9px] px-4 mx-auto text-charcoal-65";
    let dynamicRingStyles = "ring ring-sky-blue focus:ring-2";
    if (error) {
        dynamicRingStyles = "ring ring-red-500 focus:ring-2 focus:ring-red-500";
    } else if (ringColor) {
        dynamicRingStyles = `ring focus:ring-2 ${ringColor}`;
    }
    const inputStyles = `${baseStyles} ${dynamicRingStyles}`;
    return (
        <div className={className}>
            <input type={type} id={inputId} className={inputStyles} ref={ref} {...props} />
            {
                error && (
                    <p className="mt-1 text-xs text-red-500">
                        {error}
                    </p>
                )
            }
        </div>
    )
})

Input.displayName = "Input";

export default Input