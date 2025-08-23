import * as React from "react";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string,
    error?: string,
    ringColor?: string,
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className, ringColor, error, ...props }, ref) => {
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
            <textarea className={inputStyles} ref={ref} autoComplete="off" {...props} />
        </div>
    )
})

export default TextArea;