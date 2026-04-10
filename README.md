📚 FolioVault (MERN Stack)
A comprehensive digital ebook store solution built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

This application features dual-role access for Customers (Users) and Store Managers (Admins), providing a seamless experience for browsing, purchasing, and managing digital books.

🚀 Features
👤 For Users
Storefront: Browse through the complete collection of ebooks

Book Details: View descriptions, ratings, and pricing for every title

Cart System: Add multiple books to a persistent shopping cart

Wishlist: Save favorite books for future purchases

Checkout: Seamless order placement and checkout process

Auth: Secure user registration and login functionality

🛠️ For Admins (Store Managers)
Admin Dashboard: Overview of store inventory and sales

Inventory Management: Full CRUD operations (Create, Read, Update, Delete) for books

Order Management: View and track customer orders

User Records: Monitor registered user activity

Inventory Filtering: Dedicated interface for quick stock management

🛠️ Tech Stack
Frontend: React.js, Vite, Tailwind CSS, Context API

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JWT (JSON Web Tokens) & LocalStorage

⚙️ Installation & Setup
1. Clone the repository
Bash
git clone https://github.com/Aayush1-g/FolioVault-Ebook-Store.git
cd FolioVault-Ebook-Store
2. Install dependencies
Bash
# Root dependencies
npm install

# Backend dependencies
cd backend && npm install

# Frontend dependencies
cd ../frontend && npm install
3. Run the project
Bash
# In the backend folder
npm start

# In the frontend folder
npm run dev
🌐 Default Ports
Frontend: http://localhost:5173

Backend: http://localhost:5000

📂 Project Structure
Plaintext
FolioVault-Ebook-Store
│
├── backend/       # Node/Express API & Models
├── frontend/      # React/Vite UI & Components
📌 Note
For the best performance and UI responsiveness, it is recommended to view the application on a Desktop/Laptop browser.

👩‍💻 Author : Aayush Ranpara
Developed as a MERN Stack academic project submission.
