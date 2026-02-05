"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, FileText, ExternalLink, AlertCircle, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

interface Invoice {
    id: string;
    invoice_number: string;
    status: string;
    payment_status: string;
    total_amount: number;
    currency: string;
    created_at: string;
    invoice_type?: string;
    access_token?: string; // Updated from 'token'
    order_id: string;
    order?: {
        id: string;
        order_group_id?: string;
    };
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Get API Base URL from env
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api/v1';

    useEffect(() => {
        const fetchInvoices = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const accessToken = localStorage.getItem('access_token');
                const response = await fetch(`${API_BASE_URL}/invoices`, {
                    headers: {
                        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch invoices');
                }

                const result = await response.json();
                const data = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
                setInvoices(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to load invoices");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvoices();
    }, [API_BASE_URL]);

    const handleCopyLink = async (invoice: Invoice) => {
        if (!invoice.access_token) {
            toast.error("Invoice link not available");
            return;
        }

        const url = `${window.location.origin}/invoices/view/${invoice.access_token}`;

        try {
            await navigator.clipboard.writeText(url);
            setCopiedId(invoice.id);
            toast.success("Invoice link copied");
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'pending':
            case 'unpaid':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'overdue':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'cancelled':
            case 'void':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#3D4A26]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="font-orbitron font-extrabold text-2xl uppercase text-[#1A1A1A]">
                My Invoices
            </h2>

            {error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-800">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                </div>
            ) : invoices.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center border border-gray-100 shadow-sm">
                    <div className="bg-[#F0EBE3] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-[#3D4A26]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No Invoices</h3>
                    <p className="text-gray-500">You don't have any invoices yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#F0EBE3] text-[#3D4A26]">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Date</th>
                                    <th className="px-6 py-4 font-semibold">Order ID</th>
                                    <th className="px-6 py-4 font-semibold">Invoice #</th>
                                    <th className="px-6 py-4 font-semibold">Amount</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-600">
                                            {formatDate(invoice.created_at)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {invoice.order?.order_group_id || invoice.order_id}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {invoice.invoice_number}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {invoice.currency} {Number(invoice.total_amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.payment_status || 'unpaid')}`}>
                                                {(invoice.payment_status || 'Unpaid').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleCopyLink(invoice)}
                                                    className="p-2 text-gray-400 hover:text-[#3D4A26] transition-colors rounded-full hover:bg-[#F0EBE3]"
                                                    title={copiedId === invoice.id ? 'Copied' : 'Copy Link'}
                                                >
                                                    {copiedId === invoice.id ? (
                                                        <Check className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                </button>
                                                <a
                                                    href={`/invoices/view/${invoice.access_token}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3D4A26] text-white rounded-md text-xs font-medium hover:bg-[#2c361b] transition-colors"
                                                >
                                                    View
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
