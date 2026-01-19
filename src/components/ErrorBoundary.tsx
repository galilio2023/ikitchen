'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[ERROR BOUNDARY]', error, errorInfo);
        
        // In production, you could send this to an error tracking service
        if (process.env.NODE_ENV === 'production') {
            // Example: Sentry.captureException(error, { extra: errorInfo });
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-6">
                    <div className="glass-brilliant max-w-md w-full p-8 rounded-3xl border border-border text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                            <AlertTriangle className="text-destructive" size={32} />
                        </div>
                        
                        <div className="space-y-2">
                            <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
                                System_Error
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                An unexpected error occurred in the application.
                            </p>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-4 p-4 bg-destructive/5 border border-destructive/20 rounded-xl text-left">
                                <p className="text-xs font-mono text-destructive break-all">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={this.handleReset}
                            className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} />
                            Restart_System
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
