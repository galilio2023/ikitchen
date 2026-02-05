'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createProject } from '@/actions/projectActions';
import { AlertCircle } from 'lucide-react';

interface ProjectFormProps {
    onSuccess: () => void;
}

const initialState = {
  error: null,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="btn btn-primary w-full h-12 text-sm">
            {pending ? "Creating..." : "Create Project"}
        </button>
    );
}

export default function ProjectForm({ onSuccess }: ProjectFormProps) {
    const [state, formAction] = useFormState(createProject, initialState);

    // The Server Action now handles redirection, so we can call onSuccess directly.
    // We might not even need onSuccess anymore if the modal closes on navigation.
    // For now, we'll keep it simple.

    return (
        <form action={formAction} className="space-y-6">
            {state?.error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive-foreground p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold">Creation Failed</h3>
                        <p className="text-sm">{state.error}</p>
                    </div>
                </div>
            )}
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Project Name</label>
                    <input
                        id="name"
                        name="name"
                        required
                        placeholder="Enter Project Name..."
                        className="input h-12 text-sm"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Client Phone</label>
                    <input
                        id="phone"
                        name="phone"
                        placeholder="Phone Number (Optional)..."
                        className="input h-12 text-sm"
                    />
                </div>
            </div>
            <SubmitButton />
        </form>
    );
}
