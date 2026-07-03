import React from 'react';
import { User, FileText } from 'lucide-react';
import { FormInput, getInputClass } from './SalesOrderInputs';

export default function SalesOrderHeader({ header, clients, handleHeaderChange, handleClientChange, formErrors, submitAttempted }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Section */}
            <div className="bg-slate-800/40 rounded-xl border-t-4 border-t-indigo-500 border-x border-b border-slate-700/50 shadow-sm opacity-0 animate-fade-in-up overflow-hidden" style={{ animationDelay: '50ms' }}>
                <div className="p-5 border-b border-slate-700/50 bg-slate-800/60 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-bold text-indigo-300">Customer Details</h2>
                </div>
                <div className="p-6 grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-indigo-300 mb-1.5">Customer Name</label>
                        <select 
                            name="clientId" 
                            value={header.clientId} 
                            onChange={handleClientChange}
                            className={getInputClass(submitAttempted && formErrors.clientId, 'indigo')}
                        >
                            <option value="" className="bg-slate-800 text-slate-400">-- Select Customer --</option>
                            {clients.map(c => (
                                <option key={c.clientId} value={c.clientId} className="bg-slate-800">{c.customerName}</option>
                            ))}
                        </select>
                        {submitAttempted && formErrors.clientId && <p className="text-red-500 text-xs mt-1">{formErrors.clientId}</p>}
                    </div>
                    <FormInput label="Address 1" name="address1" error={formErrors.address1} value={header.address1} onChange={handleHeaderChange} showErrors={submitAttempted} theme="indigo" />
                    <FormInput label="Address 2" name="address2" error={formErrors.address2} value={header.address2} onChange={handleHeaderChange} showErrors={submitAttempted} theme="indigo" />
                    <FormInput label="Address 3" name="address3" error={formErrors.address3} value={header.address3} onChange={handleHeaderChange} showErrors={submitAttempted} theme="indigo" />
                    <div className="grid grid-cols-3 gap-4">
                        <FormInput label="Suburb" name="suburb" error={formErrors.suburb} value={header.suburb} onChange={handleHeaderChange} showErrors={submitAttempted} theme="indigo" />
                        <FormInput label="State" name="state" error={formErrors.state} value={header.state} onChange={handleHeaderChange} showErrors={submitAttempted} theme="indigo" />
                        <FormInput label="Post Code" name="postCode" error={formErrors.postCode} value={header.postCode} onChange={handleHeaderChange} showErrors={submitAttempted} theme="indigo" />
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="bg-slate-800/40 rounded-xl border-t-4 border-t-purple-500 border-x border-b border-slate-700/50 shadow-sm opacity-0 animate-fade-in-up overflow-hidden" style={{ animationDelay: '100ms' }}>
                <div className="p-5 border-b border-slate-700/50 bg-slate-800/60 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <h2 className="text-lg font-bold text-purple-300">Order Details</h2>
                </div>
                <div className="p-6 grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput label="Invoice No" name="invoiceNo" error={formErrors.invoiceNo} value={header.invoiceNo} onChange={handleHeaderChange} showErrors={submitAttempted} theme="purple" />
                        <FormInput label="Invoice Date" name="invoiceDate" type="date" error={formErrors.invoiceDate} value={header.invoiceDate} onChange={handleHeaderChange} showErrors={submitAttempted} theme="purple" />
                    </div>
                    <FormInput label="Reference No" name="referenceNo" error={formErrors.referenceNo} value={header.referenceNo} onChange={handleHeaderChange} showErrors={submitAttempted} theme="purple" />
                    <div>
                        <label className="block text-sm font-medium text-purple-300 mb-1.5">Note</label>
                        <textarea name="note" value={header.note} onChange={handleHeaderChange} rows="4" className={getInputClass(false, 'purple')}></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
}
