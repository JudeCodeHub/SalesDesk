import React from 'react';
import { FormInput, getInputClass, labelClass, inputClass } from './SalesOrderInputs';

export default function SalesOrderHeader({ header, clients, handleHeaderChange, handleClientChange, formErrors, submitAttempted }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Section */}
            <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-6 shadow-sm opacity-0 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                <h2 className="text-lg font-bold mb-5 text-slate-200 border-b border-slate-700/50 pb-3">Customer Details</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className={labelClass}>Customer Name</label>
                        <select 
                            name="clientId" 
                            value={header.clientId} 
                            onChange={handleClientChange}
                            className={getInputClass(submitAttempted && formErrors.clientId)}
                        >
                            <option value="" className="bg-slate-800 text-slate-400">-- Select Customer --</option>
                            {clients.map(c => (
                                <option key={c.clientId} value={c.clientId} className="bg-slate-800">{c.customerName}</option>
                            ))}
                        </select>
                        {submitAttempted && formErrors.clientId && <p className="text-red-500 text-xs mt-1">{formErrors.clientId}</p>}
                    </div>
                    <FormInput label="Address 1" name="address1" error={formErrors.address1} value={header.address1} onChange={handleHeaderChange} showErrors={submitAttempted} />
                    <FormInput label="Address 2" name="address2" error={formErrors.address2} value={header.address2} onChange={handleHeaderChange} showErrors={submitAttempted} />
                    <FormInput label="Address 3" name="address3" error={formErrors.address3} value={header.address3} onChange={handleHeaderChange} showErrors={submitAttempted} />
                    <div className="grid grid-cols-3 gap-4">
                        <FormInput label="Suburb" name="suburb" error={formErrors.suburb} value={header.suburb} onChange={handleHeaderChange} showErrors={submitAttempted} />
                        <FormInput label="State" name="state" error={formErrors.state} value={header.state} onChange={handleHeaderChange} showErrors={submitAttempted} />
                        <FormInput label="Post Code" name="postCode" error={formErrors.postCode} value={header.postCode} onChange={handleHeaderChange} showErrors={submitAttempted} />
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-6 shadow-sm opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <h2 className="text-lg font-bold mb-5 text-slate-200 border-b border-slate-700/50 pb-3">Order Details</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput label="Invoice No" name="invoiceNo" error={formErrors.invoiceNo} value={header.invoiceNo} onChange={handleHeaderChange} showErrors={submitAttempted} />
                        <FormInput label="Invoice Date" name="invoiceDate" type="date" error={formErrors.invoiceDate} value={header.invoiceDate} onChange={handleHeaderChange} showErrors={submitAttempted} />
                    </div>
                    <FormInput label="Reference No" name="referenceNo" error={formErrors.referenceNo} value={header.referenceNo} onChange={handleHeaderChange} showErrors={submitAttempted} />
                    <div>
                        <label className={labelClass}>Note</label>
                        <textarea name="note" value={header.note} onChange={handleHeaderChange} rows="4" className={inputClass}></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
}
