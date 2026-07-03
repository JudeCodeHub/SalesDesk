# 📦 SalesDesk

SalesDesk is a beautifully designed, modern web application for managing sales orders and generating professional invoices on the fly. It features a sleek, dark-themed user interface, instant client-side PDF generation, and a robust .NET Core backend.

---

## ✨ Features

- **Modern UI/UX**: A stunning, responsive dark mode interface powered by Tailwind CSS v4, Framer Motion animations, and Lucide Icons.
- **Sales Order Management**: Create, edit, delete, and view sales orders effortlessly.
- **Dynamic Line Items**: Automatically calculates taxes, subtotals, and totals in real-time as you add items to the order.
- **Instant PDF Generation**: Converts your sales orders into beautifully formatted PDF invoices instantly within the browser (no server trips required) using `html2pdf.js`.
- **Form Validation**: Clean UX with form requirements and database uniqueness constraints for Invoice Numbers.
- **Toast Notifications**: Sleek, non-intrusive UI notifications for all actions (saves, deletions, errors) using `react-hot-toast`.
- **Robust Backend**: Powered by ASP.NET Core with Entity Framework Core, providing a fast and reliable RESTful API.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (v18)
- **Vite** (Next-generation frontend tooling)
- **Redux Toolkit** (State management)
- **Tailwind CSS v4** (Utility-first styling framework)
- **Framer Motion** (Smooth animations)
- **Axios** (API requests)
- **html2pdf.js** (Client-side PDF rendering)

### Backend
- **C# / ASP.NET Core 8.0**
- **Entity Framework Core**
- **SQL Server** (Database layer)

---

## 🚀 Getting Started (Development)

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [.NET 8 SDK](https://dotnet.microsoft.com/)
- SQL Server (or SQL Server Express / LocalDB)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/SalesDesk.git
cd SalesDesk
```

### 2. Setup the Backend
Navigate to the backend directory, apply migrations, and run the server:
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```
The backend API will start at `http://localhost:5000` (or similar, check terminal output).

### 3. Setup the Frontend
Open a new terminal window, navigate to the frontend directory, install dependencies, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:5174`.



---

## 📸 Screenshots

<img width="1920" height="1080" alt="Screenshot 2026-07-03 201133" src="https://github.com/user-attachments/assets/103dc8e8-eb02-401b-ac4b-e6c743653312" />
<img width="1920" height="1080" alt="Screenshot 2026-07-03 201139" src="https://github.com/user-attachments/assets/d8888fe2-31bf-4c4f-a617-96056e45bbf4" />
<img width="621" height="867" alt="Screenshot 2026-07-03 201719" src="https://github.com/user-attachments/assets/9f855ac2-23b0-462a-b9eb-f8c07a5c5856" />



