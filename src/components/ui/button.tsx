import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-black uppercase tracking-tighter transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-white text-black hover:bg-slate-200 border-b-4 border-r-4 border-slate-500 active:border-b-0 active:border-r-0 active:translate-y-[2px] active:translate-x-[2px]",
                destructive: "bg-red-600 text-white hover:bg-red-700 border-b-4 border-r-4 border-red-900 active:border-0",
                outline: "border border-slate-800 bg-transparent hover:bg-slate-900 text-slate-300",
                secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 border-b-4 border-r-4 border-slate-950",
                ghost: "hover:bg-slate-900 text-slate-400 hover:text-white",
                link: "text-blue-500 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 px-3",
                lg: "h-14 px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }), "rounded-none")}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }