import React from 'react';

export const getInputClass = (hasError, theme = 'slate') => {
    let focusStyles = 'focus:border-indigo-500';
    let textAndPlaceholder = 'text-slate-200 placeholder-slate-500';
    
    if (theme === 'indigo') focusStyles = 'focus:border-indigo-500';
    else if (theme === 'purple') focusStyles = 'focus:border-purple-500';
    else if (theme === 'emerald') focusStyles = 'focus:border-emerald-500';
    
    // Use a consistent dark neutral background for all inputs to maintain a professional look
    const base = `w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none text-sm transition-all ${textAndPlaceholder}`;
    
    return `${base} ${hasError ? 'border-red-500 ring-1 ring-red-500' : focusStyles}`;
};

export const getReadOnlyClass = (theme = 'slate') => {
    let focusStyles = 'focus:border-indigo-500';
    if (theme === 'indigo') focusStyles = 'focus:border-indigo-500';
    else if (theme === 'purple') focusStyles = 'focus:border-purple-500';
    else if (theme === 'emerald') focusStyles = 'focus:border-emerald-500';
    
    return `w-full bg-slate-900 border border-slate-700/30 rounded-lg px-3 py-2 text-slate-300 placeholder-slate-500 cursor-not-allowed text-sm transition-colors focus:outline-none ${focusStyles}`;
};

export const inputClass = getInputClass(false);
export const readOnlyClass = getReadOnlyClass();

export const FormInput = ({ label, name, type = "text", error, value, onChange, showErrors, theme = "slate" }) => {
    const labelColor = theme === 'indigo' ? 'text-indigo-300' : theme === 'purple' ? 'text-purple-300' : 'text-emerald-300';
    return (
        <div>
            <label className={`block text-sm font-semibold mb-1.5 ${labelColor}`}>{label}</label>
            <input type={type} name={name} value={value} onChange={onChange} className={getInputClass(showErrors && error, theme)} />
            {showErrors && error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
        </div>
    );
};

export const TotalRow = ({ label, amount, isGrand }) => (
    <div className={`flex justify-between ${isGrand ? 'border-t border-slate-700/50 pt-4 mt-2' : 'mb-3 text-sm'}`}>
        <span className={`font-${isGrand ? 'bold text-lg text-slate-200' : 'semibold text-slate-500'} uppercase tracking-wider`}>{label}</span>
        <span className={`${isGrand ? 'font-bold text-xl text-emerald-400' : 'text-slate-300 text-base font-medium'} tabular-nums`}>${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </div>
);
