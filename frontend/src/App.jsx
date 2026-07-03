import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import SalesOrderPage from './pages/SalesOrderPage';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/sales-order" element={<Layout><SalesOrderPage /></Layout>} />
          <Route path="/sales-order/:id" element={<Layout><SalesOrderPage /></Layout>} />
        </Routes>
        <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }} />
    </Router>
  );
}

export default App;
