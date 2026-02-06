'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createProject } from '@/actions/projectActions';
import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProjectFormProps {
    onSuccess: () => void;
}

// Define the shape of the state that useFormState will manage
interface FormState {
  error: string | null;
  success: boolean;
  projectId: string | null;
}

const initialState: FormState = {
  error: null,
  success: false,
  projectId: null,
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
    const router = useRouter();
    // Correctly type the useFormState hook
    const [state, formAction] = useFormState<FormState, FormData>(createProject, initialState);

    useEffect(() => {
        if (state.error) {
            toast.error(state.error);
        }
        if (state.success && state.projectId) {
            toast.success("Project created successfully!");
            onSuccess();
            router.push(`/projects/${state.projectId}`);
        }
    }, [state, onSuccess, router]);

    return (
        <form action={formAction} className="space-y-6">
            {state.error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive-foreground p-4 rounded-lg">
                    <p className="text-sm">{state.error}</p>
                </div>
            )}
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold uppercase text-muted-foreground">Project Name</label>
                    <input id="name" name="name" required className="input h-12 text-sm" />
                </div>
                <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-bold uppercase text-muted-foreground">Client Phone</label>
                    <input id="phone" name="phone" className="input h-12 text-sm" />
                </div>
            </div>
            <SubmitButton />
        </form>
    );
}
