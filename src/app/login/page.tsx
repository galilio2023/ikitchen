'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock, User } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('ibrahimgalal2011@gmail.com');
    const [password, setPassword] = useState('@Ibrahim@galal@1');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError('ACCESS_DENIED: Invalid_Credentials');
            setLoading(false);
        } else {
            // 5. Visual confirmation (Redirect to dashboard)
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative bg-transparent">
            {/* Background Decorations */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-magic-cyan/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-magic-purple/10 blur-[150px] rounded-full pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass-brilliant p-10 rounded-[3rem] border border-border relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 rounded-3xl bg-accent/20 border border-border text-magic-cyan mb-4">
                        <Shield size={32} />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter text-foreground italic">
                        VOYAGER<span className="text-foreground/20 not-italic">_AUTH</span>
                    </h1>
                    <p className="text-[9px] font-mono text-foreground/60 uppercase tracking-[0.4em] mt-2">Neural_Sync_Required</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/50 ml-1">Entity_Identifier</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="EMAIL..."
                                    className="w-full h-12 pl-12 pr-4 rounded-2xl text-[10px] font-mono tracking-widest uppercase text-foreground bg-accent/50 border border-border placeholder:text-muted-foreground focus:outline-none focus:border-magic-cyan/40 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/50 ml-1">Secure_Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="PASSWORD..."
                                    className="w-full h-12 pl-12 pr-4 rounded-2xl text-[10px] font-mono tracking-widest uppercase text-foreground bg-accent/50 border border-border placeholder:text-muted-foreground focus:outline-none focus:border-magic-cyan/40 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="text-[9px] font-mono text-red-400 uppercase tracking-widest text-center animate-pulse">
                            {error}
                        </p>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-magic-cyan to-magic-purple text-white text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'ESTABLISHING_LINK...' : 'INITIATE_SESSION'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[8px] text-foreground/20 uppercase tracking-[0.2em]">
                        Voyager_OS v4.2 © 2026 iKitchen Systems
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
