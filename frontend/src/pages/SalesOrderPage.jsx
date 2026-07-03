import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClients } from '../redux/slices/clientSlice';
import { fetchItems } from '../redux/slices/itemSlice';
import { fetchOrderById, createOrder, updateOrder } from '../redux/slices/orderSlice';
import { Plus, Trash2, Save, X, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import SalesOrderTable from '../components/SalesOrderTable';
import SalesOrderHeader from '../components/SalesOrderHeader';
import { TotalRow } from '../components/SalesOrderInputs';

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

    const [formErrors, setFormErrors] = useState({});
    const [submitAttempted, setSubmitAttempted] = useState(false);

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
            if (submitAttempted && formErrors.clientId) {
                setFormErrors(prev => ({ ...prev, clientId: undefined }));
            }
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
        
        if (name === 'suburb' || name === 'state') {
            if (!/^[A-Za-z\s]*$/.test(value)) return;
        }
        if (['address1', 'address2', 'address3'].includes(name)) {
            if (!/^[A-Za-z0-9\s,\.\/\-]*$/.test(value)) return;
        }
        if (name === 'postCode') {
            if (!/^[0-9]{0,5}$/.test(value)) return;
        }

        setHeader(prev => ({ ...prev, [name]: value }));
        
        if (submitAttempted && formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleNumericKeyDown = (e) => {
        if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
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
        setSubmitAttempted(true);
        let errors = {};
        
        if (!header.clientId) errors.clientId = "Customer is required";
        if (!header.invoiceNo) errors.invoiceNo = "Invoice No is required";
        if (!header.invoiceDate) errors.invoiceDate = "Invoice Date is required";

        const validLines = lines.filter(l => l.itemId && parseFloat(l.quantity) > 0);
        if (validLines.length === 0) {
            errors.lines = "At least 1 line item with Item Code and Quantity > 0 is required";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setTimeout(() => {
                const firstError = document.querySelector('.border-red-500');
                if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            return;
        }
        
        setFormErrors({});

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
            const errMsg = typeof err === 'string' ? err : err?.message || JSON.stringify(err);
            if (errMsg.toLowerCase().includes("invoice number already exists") || errMsg.toLowerCase().includes("already used")) {
                setFormErrors({ invoiceNo: "This invoice number is already used" });
                setTimeout(() => {
                    const firstError = document.querySelector('.border-red-500');
                    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            } else {
                toast.error("Failed to save order: " + errMsg);
            }
        }
    };

    if (isEditMode && orderLoading) {
        return (
            <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    const labelClass = "block text-sm font-medium text-slate-400 mb-1.5";

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

            <SalesOrderHeader 
                header={header} 
                clients={clients} 
                handleHeaderChange={handleHeaderChange} 
                handleClientChange={handleClientChange} 
                formErrors={formErrors} 
                submitAttempted={submitAttempted} 
            />

            {/* Line Items */}
            <SalesOrderTable 
                lines={lines} 
                items={items} 
                handleLineItemChange={handleLineItemChange} 
                handleAddLine={handleAddLine} 
                removeLine={removeLine} 
                handleNumericKeyDown={handleNumericKeyDown} 
                submitAttempted={submitAttempted} 
                formErrors={formErrors} 
            />

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
