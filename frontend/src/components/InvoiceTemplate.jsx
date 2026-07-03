import React, { forwardRef } from 'react';
import { Package } from 'lucide-react';

const InvoiceTemplate = forwardRef(({ order, client }, ref) => {
    if (!order) return null;

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const invoiceDate = order.invoiceDate ? new Date(order.invoiceDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : today;

    return (
        <div ref={ref} className="font-sans p-10 sm:p-16 w-[800px] min-h-[1131px] mx-auto box-border" style={{ letterSpacing: 'normal', backgroundColor: '#ffffff', color: '#0f172a' }}>
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 pb-8 mb-8" style={{ borderColor: '#e2e8f0' }}>
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="w-8 h-8" style={{ color: '#4f46e5' }} />
                        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#0f172a' }}>SalesDesk</h1>
                    </div>
                    <p className="text-sm" style={{ color: '#64748b' }}>No. 45, Galle Road<br/>Colombo 03, Sri Lanka<br/>contact@salesdesk.com</p>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-light uppercase tracking-widest mb-2" style={{ color: '#cbd5e1' }}>Invoice</h2>
                    <div className="text-sm">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-right">
                            <span className="font-semibold" style={{ color: '#475569' }}>Invoice No:</span>
                            <span className="font-medium" style={{ color: '#0f172a' }}>{order.invoiceNo || 'DRAFT'}</span>
                            <span className="font-semibold" style={{ color: '#475569' }}>Date:</span>
                            <span style={{ color: '#0f172a' }}>{invoiceDate}</span>
                            {order.referenceNo && (
                                <>
                                    <span className="font-semibold" style={{ color: '#475569' }}>Reference:</span>
                                    <span style={{ color: '#0f172a' }}>{order.referenceNo}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Details */}
            <div className="mb-10">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#94a3b8' }}>Bill To</h3>
                <div style={{ color: '#1e293b' }}>
                    <p className="text-lg font-bold mb-1">{order.customerName}</p>
                    {client && (
                        <p className="leading-relaxed" style={{ color: '#475569' }}>
                            {client.address1 && <>{client.address1}<br/></>}
                            {client.address2 && <>{client.address2}<br/></>}
                            {client.address3 && <>{client.address3}<br/></>}
                            {client.suburb || client.state || client.postCode ? (
                                <>{client.suburb} {client.state} {client.postCode}</>
                            ) : null}
                        </p>
                    )}
                </div>
            </div>

            {/* Line Items */}
            <div className="mb-10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 text-sm font-bold" style={{ borderColor: '#0f172a', color: '#0f172a' }}>
                            <th className="py-3 px-2 w-32">Item Code</th>
                            <th className="py-3 px-2">Description</th>
                            <th className="py-3 px-2 text-right w-20">Qty</th>
                            <th className="py-3 px-2 text-right w-28">Price</th>
                            <th className="py-3 px-2 text-right w-24">Tax %</th>
                            <th className="py-3 px-2 text-right w-32">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {order.lines && order.lines.map((line, idx) => (
                            <tr key={idx} className="border-b" style={{ borderColor: '#e2e8f0' }}>
                                <td className="py-3 px-2 font-medium" style={{ color: '#334155' }}>{line.itemCode || line.item?.itemCode || '-'}</td>
                                <td className="py-3 px-2">
                                    <p className="font-medium" style={{ color: '#0f172a' }}>{line.description || line.item?.description || '-'}</p>
                                    {line.note && <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{line.note}</p>}
                                </td>
                                <td className="py-3 px-2 text-right" style={{ color: '#334155' }}>{line.quantity}</td>
                                <td className="py-3 px-2 text-right" style={{ color: '#334155' }}>${Number(line.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="py-3 px-2 text-right" style={{ color: '#334155' }}>{line.taxRate}%</td>
                                <td className="py-3 px-2 text-right font-bold" style={{ color: '#0f172a' }}>${Number(line.inclAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex flex-col items-end mb-16">
                <div className="w-64">
                    <div className="flex justify-between border-b pb-2 mb-2" style={{ borderColor: '#e2e8f0' }}>
                        <span style={{ color: '#64748b' }}>Subtotal (Excl)</span>
                        <span className="font-medium" style={{ color: '#0f172a' }}>${Number(order.totalExcl || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 mb-2" style={{ borderColor: '#e2e8f0' }}>
                        <span style={{ color: '#64748b' }}>Tax Total</span>
                        <span className="font-medium" style={{ color: '#0f172a' }}>${Number(order.totalTax || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-2 mt-2">
                        <span style={{ color: '#0f172a' }}>Total Due</span>
                        <span>${Number(order.totalIncl || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>

            <div className="text-center text-xs border-t pt-8 mt-auto" style={{ color: '#94a3b8', borderColor: '#e2e8f0' }}>
                Thank you for your business. For any questions, please contact us at support@salesdesk.com.
            </div>
        </div>
    );
});

export default InvoiceTemplate;
