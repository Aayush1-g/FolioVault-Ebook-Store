📚 Folio Vault: MERN eBook Store
Folio Vault is a full-stack digital marketplace for eBooks. It provides a seamless shopping journey from discovery to delivery, allowing users to browse titles and manage carts while providing admins with full oversight of sales and inventory.

🚀 Key Features
For Users:

Dynamic Catalog: Browse eBooks with a clean, responsive interface.

Smart Search: Filter books by genre and categories instantly.

Shopping Cart: Add/remove items with persistent state management.

Order Placement: Complete checkout workflow for digital book purchases.

Book Details: View metadata like Author, Pages, Publisher, and Language.

For Admins:

Inventory Control: Add, update, or delete books from the database.

Order Management: Track recent sales, customer info, and total revenue.

User Oversight: Monitor the library's user base through a dedicated panel.

🛠 Tech Stack
Frontend: React.js (UI & State Management)

Backend: Node.js & Express.js (REST API & Routing)

Database: MongoDB & Mongoose (NoSQL Data Storage)

API Calls: Axios / Fetch API

Styling: CSS3 (Modern Dark-Mode UI)

Environment: Dotenv (Secure credential management)

📂 Project Structure
backend/ - Express API, MongoDB models, and server logic.

frontend/ - React application, components, and assets.

.gitignore - Rules to keep the repository clean and secure.

⚙️ How to Run
Clone the project: git clone [YOUR_REPO_LINK]

Setup Backend:

Go to /backend

Run npm install

Create a .env file with your MONGODB_URI

Run npm start

Setup Frontend:

Go to /frontend

Run npm install

Run npm start

🔒 Security Highlights
Hidden Secrets: Database credentials are kept in .env and ignored by Git.

Decoupled Logic: The frontend never talks to the database directly; it uses a secure API layer.

Clean Repo: All unnecessary files (node_modules) are excluded for a lightweight submission.
