'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createProject } from '@/actions/projectActions';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { User, Phone, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectFormProps {
    onSuccess: () => void;
}

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
        <button 
            type="submit" 
            disabled={pending} 
            className={cn(
                "btn btn-primary w-full h-11 text-sm font-medium transition-all duration-200",
                "flex items-center justify-center gap-2 cursor-pointer",
                pending ? "opacity-80" : "hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5"
            )}
        >
            {pending ? (
                <>
                    <Loader2 className="animate-spin" size={16} />
                    جاري إنشاء التصميم...
                </>
            ) : (
                <>
                    <span>إنشاء التصميم والبدء</span>
                    <ArrowRight size={16} className="rotate-180" />
                </>
            )}
        </button>
    );
}

export default function ProjectForm({ onSuccess }: ProjectFormProps) {
    const router = useRouter();
    const [state, formAction] = useActionState(createProject, initialState);

    useEffect(() => {
        if (state.error) {
            toast.error(state.error);
        }
        if (state.success && state.projectId) {
            toast.success("تم إنشاء التصميم بنجاح!");
            onSuccess();
            router.push(`/editor/${state.projectId}`);
        }
    }, [state, onSuccess, router]);

    return (
        <form action={formAction} className="space-y-5 text-right" dir="rtl">
            {state.error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                    {state.error}
                </div>
            )}
            
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-semibold text-foreground/80 mr-1">
                        اسم العميل أو المشروع <span className="text-destructive">*</span>
                    </label>
                    <div className="relative group">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                        <input 
                            id="name" 
                            name="name" 
                            required 
                            placeholder="مثال: أ. أحمد عبد العزيز - الرياض"
                            className="w-full pr-10 pl-4 py-2.5 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50 text-right" 
                        />
                    </div>
                </div>
                
                <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-semibold text-foreground/80 mr-1">
                        رقم هاتف العميل <span className="text-muted-foreground font-normal">(اختياري)</span>
                    </label>
                    <div className="relative group">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                        <input 
                            id="phone" 
                            name="phone" 
                            placeholder="مثال: +966500000000"
                            className="w-full pr-10 pl-4 py-2.5 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50 text-right" 
                        />
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <SubmitButton />
            </div>
        </form>
    );
}
