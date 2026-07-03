# 📦 SalesDesk

A sleek, modern web application for managing sales orders and generating instant PDF invoices. Built with a React + Vite frontend and a .NET Core 8 backend.

---

## ✨ Key Features
- **Dark Mode UI**: Responsive design using Tailwind CSS v4 and Framer Motion.
- **Dynamic Calculation**: Real-time tax and total computations on line items.
- **Instant PDFs**: Client-side PDF invoice generation (`html2pdf.js`).
- **Data Integrity**: Backend and frontend validation for unique Invoice Numbers.

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Redux Toolkit, Tailwind CSS v4.
- **Backend**: C# .NET Core 8.0, Entity Framework Core, SQL Server.

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/yourusername/SalesDesk.git
cd SalesDesk

# 2. Start Backend (in /backend folder)
dotnet restore
dotnet ef database update
dotnet run

# 3. Start Frontend (in /frontend folder)
npm install
npm run dev
```

---

## 📸 Screenshots

### Home Page
![Home Page](https://github.com/user-attachments/assets/103dc8e8-eb02-401b-ac4b-e6c743653312)

### Sales Order Editor
![Sales Order Editor](https://github.com/user-attachments/assets/ba1a349a-0ef3-4ee1-84d3-ddc0ba0f310b)



### Generated PDF Invoice
![Generated PDF Invoice](https://github.com/user-attachments/assets/9f855ac2-23b0-462a-b9eb-f8c07a5c5856)
