'use client';

import React from 'react';
import { Plus } from "lucide-react";
import { useUIStore } from "@/lib/store/uiStore";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CreateProjectButtonProps extends ButtonProps {
    label?: string;
    showIcon?: boolean;
}

export default function CreateProjectButton({ 
    className, 
    variant = "default", 
    size = "default",
    label = "New Project",
    showIcon = true,
    ...props 
}: CreateProjectButtonProps) {
    const { openModal } = useUIStore();

    return (
        <Button 
            onClick={openModal}
            variant={variant}
            size={size}
            className={cn("gap-2", className)}
            {...props}
        >
            {showIcon && <Plus size={16} />}
            {label && <span>{label}</span>}
        </Button>
    );
}
