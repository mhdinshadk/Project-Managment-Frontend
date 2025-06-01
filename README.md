Product Management Application – Frontend (Next.js)
This is the frontend of a MERN stack application to manage products, categories, sub-categories, and wishlists.

🚀 Features
User authentication (signup and login)

Add and manage categories and sub-categories

Add products with multiple variants (RAM, price, quantity) and images

Edit products (including updating images)

Display products with pagination

Search and filter products

Wishlist functionality

🛠️ Tech Stack
Next.js (React Framework)

Tailwind CSS for styling (optional, if used)

Axios for API communication

JWT for handling authentication

Context API / Redux (mention if you're using any for state management)

📦 Getting Started
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/product-management-frontend.git
cd product-management-frontend
2. Install Dependencies
bash
Copy
Edit
npm install
3. Create Environment File
Create a .env.local file in the root of your frontend folder and add the following:

bash
Copy
Edit
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
⚠️ Make sure this URL matches your backend's running address and port.

4. Run the Development Server
bash
Copy
Edit
npm run dev
Open your browser and go to http://localhost:3000 to see the application running.


