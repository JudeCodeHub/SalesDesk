import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClients } from '../redux/slices/clientSlice';
import { fetchItems } from '../redux/slices/itemSlice';
import { fetchOrderById, createOrder, updateOrder } from '../redux/slices/orderSlice';
import { Plus, Trash2, Save, X, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SalesOrderPage() {
    const { id } = useParams();
    const isEditMode = !!id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { list: clients } = useSelector(state => state.clients);
    const { list: items } = useSelector(state => state.items);
    const { currentOrder, loading: orderLoading } = useSelector(state => state.orders);

    const [header, setHeader] = useState({
        clientId: '',
        customerName: '',
        address1: '',
        address2: '',
        address3: '',
        suburb: '',
        state: '',
        postCode: '',
        invoiceNo: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        referenceNo: '',
        note: ''
    });

    const [lines, setLines] = useState([{
        itemId: '', itemCode: '', description: '', note: '',
        quantity: 0, price: 0, taxRate: 0, exclAmount: 0, taxAmount: 0, inclAmount: 0
    }]);

    useEffect(() => {
        dispatch(fetchClients());
        dispatch(fetchItems());
        if (isEditMode) {
            dispatch(fetchOrderById(id));
        }
    }, [dispatch, id, isEditMode]);

    useEffect(() => {
        if (isEditMode && currentOrder && currentOrder.orderId == id) {
            setHeader(prev => ({
                ...prev,
                clientId: currentOrder.clientId || '',
                customerName: currentOrder.customerName || '',
                invoiceNo: currentOrder.invoiceNo || '',
                invoiceDate: currentOrder.invoiceDate ? currentOrder.invoiceDate.split('T')[0] : '',
                referenceNo: currentOrder.referenceNo || '',
                note: currentOrder.note || ''
            }));
            
            setLines(currentOrder.lines?.length > 0 ? currentOrder.lines.map(l => ({
                ...l,
                itemId: l.itemId || '',
                itemCode: l.itemCode || '',
                description: l.description || '',
                taxRate: l.taxRate || 0,
                quantity: l.quantity || 0,
                price: l.price || 0,
                exclAmount: l.exclAmount || 0,
                taxAmount: l.taxAmount || 0,
                inclAmount: l.inclAmount || 0
            })) : [{
                itemId: '', itemCode: '', description: '', note: '',
                quantity: 0, price: 0, taxRate: 0, exclAmount: 0, taxAmount: 0, inclAmount: 0
            }]);
        }
    }, [isEditMode, currentOrder, id]);

    useEffect(() => {
        if (header.clientId && clients.length > 0) {
            const c = clients.find(c => c.clientId == header.clientId);
            if (c) {
                setHeader(prev => ({
                    ...prev,
                    address1: c.address1 || '',
                    address2: c.address2 || '',
                    address3: c.address3 || '',
                    suburb: c.suburb || '',
                    state: c.state || '',
                    postCode: c.postCode || ''
                }));
            }
        }
    }, [header.clientId, clients]);

    const handleClientChange = (e) => {
        const val = e.target.value;
        const selected = clients.find(c => c.clientId.toString() === val);
        if (selected) {
            setHeader(prev => ({
                ...prev,
                clientId: selected.clientId,
                customerName: selected.customerName,
                address1: selected.address1 || '',
                address2: selected.address2 || '',
                address3: selected.address3 || '',
                suburb: selected.suburb || '',
                state: selected.state || '',
                postCode: selected.postCode || ''
            }));
        } else {
            setHeader(prev => ({
                ...prev,
                clientId: '',
                customerName: '',
                address1: '', address2: '', address3: '', suburb: '', state: '', postCode: ''
            }));
        }
    };

    const handleHeaderChange = (e) => {
        const { name, value } = e.target;
        setHeader(prev => ({ ...prev, [name]: value }));
    };

    const handleLineItemChange = (index, e) => {
        const { name, value } = e.target;
        setLines(prev => {
            const newLines = [...prev];
            const row = { ...newLines[index] };
            
            if (name === 'itemId') {
                const selectedItem = items.find(i => i.itemId.toString() === value);
                if (selectedItem) {
                    row.itemId = selectedItem.itemId;
                    row.itemCode = selectedItem.itemCode;
                    row.description = selectedItem.description;
                    row.price = selectedItem.price;
                } else {
                    row.itemId = ''; row.itemCode = ''; row.description = ''; row.price = 0;
                }
            } else {
                row[name] = value;
            }

            const qty = parseFloat(row.quantity) || 0;
            const price = parseFloat(row.price) || 0;
            const taxR = parseFloat(row.taxRate) || 0;

            row.exclAmount = qty * price;
            row.taxAmount = (row.exclAmount * taxR) / 100;
            row.inclAmount = row.exclAmount + row.taxAmount;

            newLines[index] = row;
            return newLines;
        });
    };

    const handleAddLine = () => {
        setLines(prev => [...prev, {
            itemId: '', itemCode: '', description: '', note: '',
            quantity: 0, price: 0, taxRate: 0, exclAmount: 0, taxAmount: 0, inclAmount: 0
        }]);
    };

    const removeLine = (index) => {
        if (lines.length > 1) {
            setLines(prev => prev.filter((_, i) => i !== index));
        } else {
            setLines([{
                itemId: '', itemCode: '', description: '', note: '',
                quantity: 0, price: 0, taxRate: 0, exclAmount: 0, taxAmount: 0, inclAmount: 0
            }]);
        }
    };

    const totals = useMemo(() => {
        let excl = 0, tax = 0, incl = 0;
        lines.forEach(l => {
            excl += (l.exclAmount || 0);
            tax += (l.taxAmount || 0);
            incl += (l.inclAmount || 0);
        });
        return { totalExcl: excl, totalTax: tax, totalIncl: incl };
    }, [lines]);

    const handleSave = async () => {
        if (!header.clientId) {
            alert("Please select a customer.");
            return;
        }

        const payload = {
            clientId: parseInt(header.clientId, 10),
            invoiceNo: header.invoiceNo,
            invoiceDate: header.invoiceDate,
            referenceNo: header.referenceNo,
            note: header.note,
            totalExcl: totals.totalExcl,
            totalTax: totals.totalTax,
            totalIncl: totals.totalIncl,
            lines: lines.filter(l => l.itemId).map(l => ({
                itemId: parseInt(l.itemId, 10),
                note: l.note,
                quantity: parseFloat(l.quantity) || 0,
                price: parseFloat(l.price) || 0,
                taxRate: parseFloat(l.taxRate) || 0,
                exclAmount: l.exclAmount || 0,
                taxAmount: l.taxAmount || 0,
                inclAmount: l.inclAmount || 0
            }))
        };

        try {
            if (isEditMode) {
                payload.orderId = parseInt(id, 10);
                await dispatch(updateOrder({ id, orderData: payload })).unwrap();
                toast.success("Order updated successfully!");
            } else {
                await dispatch(createOrder(payload)).unwrap();
                toast.success("Order created successfully!");
            }
            navigate('/');
        } catch (err) {
            toast.error("Failed to save order: " + err);
        }
    };

    if (isEditMode && orderLoading) {
        return (
            <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    const inputClass = "w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-colors";
    const readOnlyClass = "w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 cursor-not-allowed text-sm opacity-80 transition-colors";
    const inputClassRight = `${inputClass} text-right`;
    const readOnlyClassRight = `${readOnlyClass} text-right`;
    const labelClass = "block text-sm font-medium text-slate-400 mb-1.5";

    const FormInput = ({ label, name, type = "text" }) => (
        <div>
            <label className={labelClass}>{label}</label>
            <input type={type} name={name} value={header[name]} onChange={handleHeaderChange} className={inputClass} />
        </div>
    );

    const TotalRow = ({ label, amount, isGrand }) => (
        <div className={`flex justify-between ${isGrand ? 'border-t border-slate-700/50 pt-4 mt-2' : 'mb-3 text-sm'}`}>
            <span className={`font-${isGrand ? 'bold text-lg text-slate-200' : 'semibold text-slate-500'} uppercase tracking-wider`}>{label}</span>
            <span className={`${isGrand ? 'font-bold text-xl text-emerald-400' : 'text-slate-300 text-base font-medium'} tabular-nums`}>${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
    );

    return (
        <div className="w-full pb-32">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <ShoppingCart className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                        {isEditMode ? (header.invoiceNo ? `Edit Order: ${header.invoiceNo}` : 'Edit Sales Order') : 'New Sales Order'}
                    </h1>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                        onClick={() => navigate('/')} 
                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-700/30 text-red-400 hover:text-red-300 font-medium py-2 px-4 rounded-lg shadow-sm transition-colors text-sm w-full sm:w-auto justify-center"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-medium py-2 px-6 rounded-lg shadow-sm text-sm w-full sm:w-auto justify-center"
                    >
                        <Save className="w-4 h-4" />
                        Save Order
                    </button>
                </div>
            </div>

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
                                className={inputClass}
                            >
                                <option value="" className="bg-slate-800 text-slate-400">-- Select Customer --</option>
                                {clients.map(c => (
                                    <option key={c.clientId} value={c.clientId} className="bg-slate-800">{c.customerName}</option>
                                ))}
                            </select>
                        </div>
                        <FormInput label="Address 1" name="address1" />
                        <FormInput label="Address 2" name="address2" />
                        <FormInput label="Address 3" name="address3" />
                        <div className="grid grid-cols-3 gap-4">
                            <FormInput label="Suburb" name="suburb" />
                            <FormInput label="State" name="state" />
                            <FormInput label="Post Code" name="postCode" />
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-6 shadow-sm opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-lg font-bold mb-5 text-slate-200 border-b border-slate-700/50 pb-3">Order Details</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="Invoice No" name="invoiceNo" />
                            <FormInput label="Invoice Date" name="invoiceDate" type="date" />
                        </div>
                        <FormInput label="Reference No" name="referenceNo" />
                        <div>
                            <label className={labelClass}>Note</label>
                            <textarea name="note" value={header.note} onChange={handleHeaderChange} rows="4" className={inputClass}></textarea>
                        </div>
                    </div>
                </div>
            </div>

            {/* Line Items */}
            <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 mb-6 overflow-hidden shadow-sm opacity-0 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <div className="p-5 border-b border-slate-700/50 bg-slate-800/60 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-200">Items</h2>
                    <button onClick={handleAddLine} className="flex items-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 hover:text-indigo-300 text-xs font-semibold py-1.5 px-3 rounded-lg border border-indigo-500/30 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                        Add
                    </button>
                </div>
                <div className="overflow-x-auto p-4">
                    <table className="min-w-full border-separate" style={{ borderSpacing: '0 8px' }}>
                        <thead>
                            <tr>
                                <th className="px-2 pb-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-40">Item Code</th>
                                <th className="px-2 pb-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-56">Description</th>
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
                                        <select name="itemId" value={line.itemId} onChange={e => handleLineItemChange(index, e)} className={inputClass}>
                                            <option value="" className="bg-slate-800">- Desc -</option>
                                            {items.map(i => <option key={i.itemId} value={i.itemId} className="bg-slate-800">{i.description}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-1">
                                        <input type="text" name="note" value={line.note} onChange={e => handleLineItemChange(index, e)} className={inputClass} placeholder="Optional" />
                                    </td>
                                    <td className="px-1">
                                        <input type="number" step="1" name="quantity" value={line.quantity} onChange={e => handleLineItemChange(index, e)} className={inputClassRight} />
                                    </td>
                                    <td className="px-1">
                                        <input type="text" readOnly value={Number(line.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} className={readOnlyClassRight} />
                                    </td>
                                    <td className="px-1">
                                        <input type="number" step="0.01" name="taxRate" value={line.taxRate} onChange={e => handleLineItemChange(index, e)} className={inputClassRight} />
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

            {/* Totals Section */}
            <div className="flex justify-end opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-6 w-80 shadow-sm">
                    <TotalRow label="Total Excl" amount={totals.totalExcl} />
                    <TotalRow label="Total Tax" amount={totals.totalTax} />
                    <TotalRow label="Total" amount={totals.totalIncl} isGrand={true} />
                </div>
            </div>
        </div>
    );
}
