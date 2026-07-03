# 📦 SalesDesk

SalesDesk is a beautifully designed, modern web application for managing sales orders and generating professional invoices on the fly. It features a sleek, dark-themed user interface, instant client-side PDF generation, and a robust .NET Core backend.

---

## ✨ Features

- **Modern UI/UX**: A stunning, responsive dark mode interface powered by Tailwind CSS v4, Framer Motion animations, and Lucide Icons.
- **Sales Order Management**: Create, edit, delete, and view sales orders effortlessly.
- **Dynamic Line Items**: Automatically calculates taxes, subtotals, and totals in real-time as you add items to the order.
- **Instant PDF Generation**: Converts your sales orders into beautifully formatted PDF invoices instantly within the browser (no server trips required) using `dom-to-image` and `jsPDF`.
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
- **dom-to-image & jsPDF** (Client-side PDF rendering)

### Backend
- **C# / ASP.NET Core**
- **Entity Framework Core**
- **SQL Server / SQLite** (Database layer)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [.NET 8 SDK](https://dotnet.microsoft.com/)
- SQL Server (or you can easily swap the connection string to use SQLite/LocalDB)

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
The backend API will start at `http://localhost:5000` (or similar).

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

*(Add screenshots of your application here after pushing to GitHub! Recommended: Home Page, Sales Order Editor, and the Generated PDF Invoice)*

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/yourusername/SalesDesk/issues).

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
