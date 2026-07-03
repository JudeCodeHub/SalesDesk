import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { inputClass, inputClassRight, readOnlyClassRight } from './SalesOrderInputs';

export default function SalesOrderTable({ 
    lines, items, handleLineItemChange, handleAddLine, removeLine, 
    handleNumericKeyDown, submitAttempted, formErrors 
}) {
    return (
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 mb-6 overflow-hidden shadow-sm opacity-0 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <div className="p-5 border-b border-slate-700/50 bg-slate-800/60 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-200">Items</h2>
                <button onClick={handleAddLine} className="flex items-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 hover:text-indigo-300 text-xs font-semibold py-1.5 px-3 rounded-lg border border-indigo-500/30 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    Add
                </button>
            </div>
            {submitAttempted && formErrors.lines && (
                <div className="px-5 pb-3">
                    <p className="text-red-500 text-sm">{formErrors.lines}</p>
                </div>
            )}
            <div className="overflow-x-auto p-4">
                <table className="min-w-full border-separate" style={{ borderSpacing: '0 8px' }}>
                    <thead>
                        <tr>
                            <th className="px-2 pb-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-40">Item Code</th>
                            <th className="px-2 pb-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-96 min-w-[350px]">Description</th>
                            <th className="px-2 pb-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-48">Note</th>
                            <th className="px-2 pb-2 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider w-24">Qty</th>
                            <th className="px-2 pb-2 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider w-32">Price</th>
                            <th className="px-2 pb-2 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider w-24">Tax (%)</th>
                            <th className="px-2 pb-2 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">Excl</th>
                            <th className="px-2 pb-2 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">Tax</th>
                            <th className="px-2 pb-2 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">Incl</th>
                            <th className="px-2 pb-2"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-transparent">
                        {lines.map((line, index) => (
                            <tr key={index} className="group">
                                <td className="px-1">
                                    <select name="itemId" value={line.itemId} onChange={e => handleLineItemChange(index, e)} className={inputClass}>
                                        <option value="" className="bg-slate-800">- Code -</option>
                                        {items.map(i => <option key={i.itemId} value={i.itemId} className="bg-slate-800">{i.itemCode}</option>)}
                                    </select>
                                </td>
                                <td className="px-1">
                                    <select name="itemId" value={line.itemId} onChange={e => handleLineItemChange(index, e)} className={inputClass} title={line.description}>
                                        <option value="" className="bg-slate-800">- Desc -</option>
                                        {items.map(i => <option key={i.itemId} value={i.itemId} className="bg-slate-800">{i.description}</option>)}
                                    </select>
                                </td>
                                <td className="px-1">
                                    <input type="text" name="note" value={line.note} onChange={e => handleLineItemChange(index, e)} className={inputClass} placeholder="Optional" />
                                </td>
                                <td className="px-1">
                                    <input type="number" step="1" min="1" name="quantity" value={line.quantity} onChange={e => handleLineItemChange(index, e)} onKeyDown={handleNumericKeyDown} className={inputClassRight} />
                                </td>
                                <td className="px-1">
                                    <input type="text" readOnly value={Number(line.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} className={readOnlyClassRight} />
                                </td>
                                <td className="px-1">
                                    <input type="number" step="0.01" min="0" max="100" name="taxRate" value={line.taxRate} onChange={e => handleLineItemChange(index, e)} onKeyDown={handleNumericKeyDown} className={inputClassRight} />
                                </td>
                                <td className="px-2 text-right text-sm text-slate-400 tabular-nums font-medium">${Number(line.exclAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="px-2 text-right text-sm text-slate-400 tabular-nums font-medium">${Number(line.taxAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="px-2 text-right text-sm font-bold text-slate-200 tabular-nums">${Number(line.inclAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="px-1 text-center">
                                    <button onClick={() => removeLine(index)} className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" title="Remove Line">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
