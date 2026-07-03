import React, { useEffect, useRef, useState } from 'react';
import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf';
import api from '../services/api';
import InvoiceTemplate from './InvoiceTemplate';

export default function PdfGenerator({ orderId, onComplete, onError }) {
    const invoiceRef = useRef(null);
    const hasGenerated = useRef(false);
    const [order, setOrder] = useState(null);
    const [client, setClient] = useState(null);

    // Fetch data
    useEffect(() => {
        if (!orderId) return;
        hasGenerated.current = false;
        const fetchData = async () => {
            try {
                const [orderRes, clientsRes] = await Promise.all([
                    api.get(`/salesorders/${orderId}`),
                    api.get('/clients')
                ]);
                const fetchedOrder = orderRes.data;
                setOrder(fetchedOrder);
                const fetchedClient = clientsRes.data.find(c => c.clientId === fetchedOrder.clientId);
                setClient(fetchedClient || null);
            } catch (err) {
                onError(err.message || "Failed to fetch data for PDF");
            }
        };
        fetchData();
    }, [orderId, onError]);

    // Generate PDF once data is loaded and DOM is updated
    useEffect(() => {
        if (order && invoiceRef.current && !hasGenerated.current) {
            hasGenerated.current = true;
            const generate = async () => {
                try {
                    // Give DOM a tiny tick to paint styles before capturing
                    await new Promise(r => setTimeout(r, 100)); 
                    
                    const dataUrl = await domtoimage.toJpeg(invoiceRef.current, { quality: 0.98, bgcolor: '#ffffff' });
                    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
                    
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (invoiceRef.current.offsetHeight * pdfWidth) / invoiceRef.current.offsetWidth;
                    
                    pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`Invoice_${order.invoiceNo || 'Draft'}.pdf`);
                    
                    onComplete();
                } catch (err) {
                    onError(err.message || "Failed to generate PDF document");
                }
            };
            generate();
        }
    }, [order, onComplete, onError]);

    if (!order) return null;

    return (
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
            <InvoiceTemplate ref={invoiceRef} order={order} client={client} />
        </div>
    );
}
