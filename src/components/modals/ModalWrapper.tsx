'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChefHat } from 'lucide-react';

interface ModalWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string; // Added optional description prop
    children: React.ReactNode;
}

export default function ModalWrapper({ isOpen, onClose, title, description, children }: ModalWrapperProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-gradient-to-b from-primary/5 to-background p-6 border-b border-border/50">
                    <DialogHeader>
                        <div className="mx-auto mb-4 p-3 bg-background rounded-full shadow-sm border border-border/50 w-fit">
                            <ChefHat className="w-8 h-8 text-primary" />
                        </div>
                        <DialogTitle className="text-center text-xl font-bold tracking-tight">
                            {title}
                        </DialogTitle>
                        {description && (
                            <p className="text-center text-sm text-muted-foreground mt-1">
                                {description}
                            </p>
                        )}
                    </DialogHeader>
                </div>
                
                <div className="p-6 pt-4">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}
