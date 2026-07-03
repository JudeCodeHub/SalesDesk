import React from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import { getInputClass, getReadOnlyClass } from './SalesOrderInputs';

const emeraldInput = getInputClass(false, 'emerald');
const emeraldReadOnly = getReadOnlyClass('emerald');

export default function SalesOrderTable({ 
    lines, items, handleLineItemChange, handleAddLine, removeLine, 
    handleNumericKeyDown, submitAttempted, formErrors 
}) {
    return (
        <div className="bg-slate-800/40 rounded-xl border-t-4 border-t-emerald-500 border-x border-b border-slate-700/50 mb-6 overflow-hidden shadow-sm opacity-0 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <div className="p-5 border-b border-slate-700/50 bg-slate-800/60 flex justify-between items-center">
                <h2 className="text-lg font-bold text-emerald-300 flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-400" />
                    Items
                </h2>
                <button onClick={handleAddLine} className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 text-xs font-semibold py-1.5 px-3 rounded-lg border border-emerald-500/30 transition-colors">
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
                            <th className="px-2 pb-2 text-left text-xs font-semibold text-emerald-300/80 uppercase tracking-wider w-40">Item Code</th>
                            <th className="px-2 pb-2 text-left text-xs font-semibold text-emerald-300/80 uppercase tracking-wider w-96 min-w-[350px]">Description</th>
                            <th className="px-2 pb-2 text-left text-xs font-semibold text-emerald-300/80 uppercase tracking-wider w-48">Note</th>
                            <th className="px-2 pb-2 text-left text-xs font-semibold text-emerald-300/80 uppercase tracking-wider w-24">Qty</th>
                            <th className="px-2 pb-2 text-left text-xs font-semibold text-emerald-300/80 uppercase tracking-wider w-32">Price</th>
                            <th className="px-2 pb-2 text-left text-xs font-semibold text-emerald-300/80 uppercase tracking-wider w-24">Tax (%)</th>
                            <th className="px-2 pb-2 text-left text-xs font-semibold text-emerald-300/80 uppercase tracking-wider w-28">Excl</th>
                            <th className="px-2 pb-2 text-left text-xs font-semibold text-emerald-300/80 uppercase tracking-wider w-28">Tax</th>
                            <th className="px-2 pb-2 text-left text-xs font-semibold text-emerald-300/80 uppercase tracking-wider w-28">Incl</th>
                            <th className="px-2 pb-2"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-transparent">
                        {lines.map((line, index) => (
                            <tr key={index} className="group">
                                <td className="px-1">
                                    <select name="itemId" value={line.itemId} onChange={e => handleLineItemChange(index, e)} className={emeraldInput}>
                                        <option value="" className="bg-slate-800">- Code -</option>
                                        {items.map(i => <option key={i.itemId} value={i.itemId} className="bg-slate-800">{i.itemCode}</option>)}
                                    </select>
                                </td>
                                <td className="px-1">
                                    <select name="itemId" value={line.itemId} onChange={e => handleLineItemChange(index, e)} className={emeraldInput} title={line.description}>
                                        <option value="" className="bg-slate-800">- Desc -</option>
                                        {items.map(i => <option key={i.itemId} value={i.itemId} className="bg-slate-800">{i.description}</option>)}
                                    </select>
                                </td>
                                <td className="px-1">
                                    <input type="text" name="note" value={line.note} onChange={e => handleLineItemChange(index, e)} className={emeraldInput} placeholder="Optional" />
                                </td>
                                <td className="px-1">
                                    <input type="number" step="1" min="1" name="quantity" value={line.quantity} onChange={e => handleLineItemChange(index, e)} onKeyDown={handleNumericKeyDown} className={emeraldInput} />
                                </td>
                                <td className="px-1">
                                    <input type="text" readOnly value={Number(line.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} className={emeraldReadOnly} />
                                </td>
                                <td className="px-1">
                                    <input type="number" step="0.01" min="0" max="100" name="taxRate" value={line.taxRate} onChange={e => handleLineItemChange(index, e)} onKeyDown={handleNumericKeyDown} className={emeraldInput} />
                                </td>
                                <td className="px-1">
                                    <input type="text" readOnly value={`$${Number(line.exclAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} className={emeraldReadOnly} />
                                </td>
                                <td className="px-1">
                                    <input type="text" readOnly value={`$${Number(line.taxAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} className={emeraldReadOnly} />
                                </td>
                                <td className="px-1">
                                    <input type="text" readOnly value={`$${Number(line.inclAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} className={`${emeraldReadOnly} font-bold text-slate-200`} />
                                </td>
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
