'use client';

import { useState } from 'react';
import { useAppDispatch } from "@/lib/hooks";
import { addProjectThunk } from "@/lib/features/kitchens/kitchenSlice";
import { useRouter } from 'next/navigation';

import FormButton from './FormButton';

interface ProjectFormProps {
    onSuccess: () => void;
}

export default function ProjectForm({ onSuccess }: ProjectFormProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        clientName: '',
        phone: '',
        status: 'draft' as const,
        tags: [] as string[],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await dispatch(addProjectThunk({
                ...formData,
                progress: 0,
                walls: [{ id: 'wall-1', label: 'Wall 1', length: 300, height: 240, thickness: 10 }]
            })).unwrap();
            
            if (res && (res._id || res.id)) {
                onSuccess();
                router.push(`/projects/${res._id || res.id}`);
            }
        } catch (err) {
            // Error is handled by Redux slice, but we can catch it here for local UI
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] !text-foreground/30 ml-1">Client_Identifier</label>
                    <input
                        required
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        placeholder="ENTER_CLIENT_NAME..."
                        className="w-full h-12 px-4 rounded-2xl text-[10px] font-mono tracking-widest uppercase text-foreground placeholder:text-muted-foreground bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] !text-foreground/30 ml-1">Communication_Uplink</label>
                    <input
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="PHONE_NUMBER..."
                        className="w-full h-12 px-4 rounded-2xl text-[10px] font-mono tracking-widest uppercase text-foreground placeholder:text-muted-foreground bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                </div>
            </div>

            <FormButton loading={loading} label="Initialize_New_Node" />
        </form>
    );
}