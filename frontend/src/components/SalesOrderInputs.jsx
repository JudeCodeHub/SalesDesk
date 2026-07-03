import React from 'react';

export const inputClassBase = "w-full bg-slate-800 border rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-colors";
export const getInputClass = (hasError) => `${inputClassBase} ${hasError ? 'border-red-500' : 'border-slate-600 focus:border-transparent'}`;
export const inputClass = getInputClass(false);
export const inputClassRight = `${inputClass} text-right`;
export const readOnlyClass = "w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 cursor-not-allowed text-sm opacity-80 transition-colors";
export const readOnlyClassRight = `${readOnlyClass} text-right`;
export const labelClass = "block text-sm font-medium text-slate-400 mb-1.5";

export const FormInput = ({ label, name, type = "text", error, value, onChange, showErrors }) => (
    <div>
        <label className={labelClass}>{label}</label>
        <input type={type} name={name} value={value} onChange={onChange} className={getInputClass(showErrors && error)} />
        {showErrors && error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

export const TotalRow = ({ label, amount, isGrand }) => (
    <div className={`flex justify-between ${isGrand ? 'border-t border-slate-700/50 pt-4 mt-2' : 'mb-3 text-sm'}`}>
        <span className={`font-${isGrand ? 'bold text-lg text-slate-200' : 'semibold text-slate-500'} uppercase tracking-wider`}>{label}</span>
        <span className={`${isGrand ? 'font-bold text-xl text-emerald-400' : 'text-slate-300 text-base font-medium'} tabular-nums`}>${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </div>
);
