'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface SignalLostProps {
    error: string;
}

export default function SignalLost({ error }: SignalLostProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h2 className="text-2xl font-bold text-destructive">Connection Error</h2>
            <p className="text-muted-foreground mt-2 max-w-md">
                There was a problem connecting to the server. Please check your network connection and try again.
            </p>
            <p className="text-xs text-muted-foreground/50 mt-4 bg-muted p-2 rounded-md">
                Error: {error}
            </p>
            <Link href="/dashboard" className="btn btn-primary mt-6">
                Return to Dashboard
            </Link>
        </div>
    );
}
