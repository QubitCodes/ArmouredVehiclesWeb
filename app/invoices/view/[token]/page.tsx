'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';

export default function InvoiceViewPage() {
    const params = useParams();
    const token = params.token as string;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [htmlContent, setHtmlContent] = useState<string>('');

    // Get API Base URL from env
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api/v1';

    useEffect(() => {
        if (!token) {
            setError('Invalid invoice link');
            setIsLoading(false);
            return;
        }

        const fetchInvoiceHtml = async () => {
            try {
                // Get auth token from storage
                const accessToken = localStorage.getItem('access_token'); // Standard key in Web project

                const response = await fetch(`${API_BASE_URL}/invoices/view/${token}/html`, {
                    headers: {
                        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
                        'Content-Type': 'application/json'
                        // 'x-session-id': ... // Optional if we want full fidelity
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        // Redirect to login if unauthorized
                        const returnUrl = encodeURIComponent(window.location.pathname);
                        window.location.href = `/login?returnUrl=${returnUrl}`;
                        return;
                    }
                    if (response.status === 403) {
                        throw new Error('You are not authorized to view this invoice.');
                    }
                    throw new Error('Failed to load invoice');
                }

                const html = await response.text();
                setHtmlContent(html);
                setIsLoading(false);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Failed to load invoice');
                setIsLoading(false);
            }
        };

        fetchInvoiceHtml();
    }, [token, API_BASE_URL]);

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-4">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-neutral-900 mb-2">Error Loading Invoice</h1>
                    <p className="text-neutral-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors"
                    >
                        Retry
                    </button>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="px-4 py-2 mt-2 text-neutral-600 hover:text-neutral-900 block mx-auto underline"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-neutral-100">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 transition-opacity">
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-neutral-500 mb-2" />
                        <p className="text-sm font-medium text-neutral-500">Loading Invoice...</p>
                    </div>
                </div>
            )}

            {htmlContent && (
                <iframe
                    srcDoc={htmlContent}
                    className="w-full h-full border-none"
                    title={`Invoice ${token}`}
                    onLoad={handleIframeLoad}
                />
            )}
        </div>
    );
}
