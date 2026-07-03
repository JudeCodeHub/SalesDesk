import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrders, deleteOrder } from '../redux/slices/orderSlice';
import { Plus, Trash2, FilePlus2, FileText, Printer, Loader2, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import PdfGenerator from '../components/PdfGenerator';

export default function HomePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { list: orders, loading, error } = useSelector((state) => state.orders);
    const [downloadingOrderId, setDownloadingOrderId] = React.useState(null);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const handleDelete = (e, orderId) => {
        e.stopPropagation();
        toast((t) => (
            <div className="flex flex-col gap-3">
                <span className="font-medium text-slate-100">Are you sure you want to delete this order?</span>
                <div className="flex gap-2">
                    <button 
                        onClick={() => {
                            toast.dismiss(t.id);
                            dispatch(deleteOrder(orderId))
                                .unwrap()
                                .then(() => toast.success("Order deleted successfully!"))
                                .catch(() => toast.error("Failed to delete order."));
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                    >
                        Delete
                    </button>
                    <button 
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1.5 rounded text-sm transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: Infinity });
    };

    const handleAddNew = () => {
        navigate('/sales-order');
    };

    const totalOrders = orders ? orders.length : 0;
    const totalRevenue = orders ? orders.reduce((sum, o) => sum + (o.totalIncl || 0), 0) : 0;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, x: -25, scale: 0.95 },
        visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 28 } }
    };

    const OrderCard = ({ order, index }) => (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -1, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
            onClick={() => navigate(`/sales-order/${order.orderId}`)}
            className="relative group grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 cursor-pointer transition-colors"
        >
            <div className="hidden md:block col-span-1 text-slate-500 font-bold text-lg opacity-40">
                {(index + 1).toString().padStart(2, '0')}
            </div>
            
            <div className="col-span-1 md:col-span-2 flex items-center gap-3">
                <div className="p-2 bg-slate-700/50 rounded-lg text-slate-400">
                    <FileText className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-200">{order.invoiceNo || 'Draft'}</span>
            </div>

            <div className="col-span-1 md:col-span-2 text-slate-300 truncate font-medium">{order.customerName || '-'}</div>
            <div className="col-span-1 md:col-span-2 text-slate-400 text-sm">{order.invoiceDate ? new Date(order.invoiceDate).toLocaleDateString() : '-'}</div>
            <div className="col-span-1 md:col-span-2 text-slate-400 text-sm truncate">{order.referenceNo || '-'}</div>
            <div className="col-span-1 md:col-span-2 md:text-right font-bold text-slate-200 tabular-nums text-lg pr-6">
                ${Number(order.totalIncl || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            <div className="col-span-1 flex items-center justify-end gap-1">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setDownloadingOrderId(order.orderId);
                    }}
                    disabled={downloadingOrderId === order.orderId}
                    className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-md transition-colors disabled:opacity-50" 
                    title="Download PDF"
                >
                    {downloadingOrderId === order.orderId ? (
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    ) : (
                        <Printer className="w-4 h-4" />
                    )}
                </button>
                <button 
                    onClick={(e) => handleDelete(e, order.orderId)} 
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-md transition-colors" 
                    title="Delete Order"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );

    return (
        <div className="w-full">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                <button 
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-medium py-2 px-4 rounded-lg shadow-sm text-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Order
                </button>
                <div className="flex items-center gap-3 sm:ml-auto">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Package className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <h1 className="text-xl font-bold text-slate-100 tracking-tight">SalesDesk Orders</h1>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <span className="text-slate-400 font-medium text-sm hidden sm:inline">
                        {totalOrders} {totalOrders === 1 ? 'Order' : 'Orders'} • ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Total
                    </span>
                </div>
            </div>

            {/* Column Headers */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 mb-2 text-xs uppercase tracking-wider text-slate-500 font-semibold opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="col-span-1">#</div>
                <div className="col-span-2">Invoice No</div>
                <div className="col-span-2">Customer</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Reference</div>
                <div className="col-span-2 text-right pr-6">Total Incl</div>
                <div className="col-span-1"></div>
            </div>

            {/* Main Content Area */}
            {loading ? (
                <div className="flex justify-center items-center py-24 rounded-xl opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
            ) : error ? (
                <div className="text-red-400 flex justify-center py-12 bg-red-900/20 rounded-xl border border-red-900/50 shadow-sm opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    Error loading orders: {error}
                </div>
            ) : orders && orders.length > 0 ? (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-2 pb-12"
                >
                    {orders.map((order, index) => (
                        <OrderCard key={order.orderId} order={order} index={index} />
                    ))}
                </motion.div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-slate-800/30 rounded-xl border border-slate-700/50 shadow-sm border-dashed opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="bg-slate-800 p-4 rounded-full mb-4 ring-1 ring-slate-700">
                        <FilePlus2 className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-200 mb-1">No orders yet</h3>
                    <p className="text-slate-400 mb-6 text-center max-w-sm">Get started by creating your first sales order. It will show up here once saved.</p>
                    <button 
                        onClick={handleAddNew}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-medium py-2.5 px-6 rounded-lg shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Create your first order
                    </button>
                </div>
            )}

            {downloadingOrderId && (
                <PdfGenerator 
                    orderId={downloadingOrderId}
                    onComplete={() => {
                        setDownloadingOrderId(null);
                        toast.success("PDF Downloaded successfully!");
                    }}
                    onError={(err) => {
                        setDownloadingOrderId(null);
                        toast.error(`Failed to download PDF: ${err}`);
                    }}
                />
            )}
        </div>
    );
}
