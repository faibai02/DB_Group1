# 🍕 Food Delivery App

A modern full-stack food delivery application built with **Go**, **React**, **TypeScript**, and **MySQL**. Order your favorite meals from multiple restaurants and get them delivered to your doorstep!

## 📋 Features

✅ **Authentication System**
- User registration with email & password hashing (bcrypt)
- Secure login with JWT tokens (2-min expiration, HTTP-only cookies)
- Session persistence across page refreshes
- Automatic logout

✅ **Browse & Order**
- Dynamic restaurant listing with real images
- Browse dishes by category
- Individual restaurant menus
- Add items to cart with quantity control
- View detailed product information

✅ **Shopping Cart**
- Add/remove items
- Update quantities
- Real-time total calculation
- Persistent cart (survives page refresh)
- Authentication required to checkout

✅ **Order Management**
- Place orders with delivery address
- View order history
- Track order status (Pending, Confirmed, Preparing, Delivering, Delivered)
- Edit orders (delivery address) while Pending
- Delete orders while Pending

✅ **User Profile**
- View authenticated user information (name, email)
- Secure profile page (authentication required)

## 🛠️ Tech Stack

### Backend
- **Language:** Go 1.25.2
- **Framework:** Gin (web framework)
- **Database:** MySQL 8.2.4
- **Authentication:** JWT + bcrypt
- **CORS:** Configured for development

### Frontend
- **Framework:** React 19.2.3
- **Language:** TypeScript
- **Build Tool:** Vite 6.2.0
- **Styling:** Tailwind CSS
- **HTTP Client:** Fetch API

### Database
- **Primary Database:** MySQL (food_delivery_db)
- **Tables:** 8 (customers, restaurants, dishes, orders, order_items, delivery_persons, chat_messages)

## 📁 Project Structure

```
DB_Group1/
├── Go_api/                 # Backend (Go)
│   ├── main.go
│   ├── server.go           # HTTP routes & handlers
│   ├── storage.go          # Database operations
│   ├── go.mod
│   └── go.sum
├── src/                    # Frontend (React/TypeScript)
│   ├── api/                # API calls
│   │   ├── http.ts
│   │   ├── menu.ts
│   │   ├── orders.ts
│   │   ├── ordersApi.ts
│   │   └── restaurants.ts
│   ├── context/            # React Context
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── screens/            # Page components
│   │   ├── Home.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Orders.tsx
│   │   ├── Profile.tsx
│   │   ├── Restaurants.tsx
│   │   ├── RestaurantMenu.tsx
│   │   ├── SignUp.tsx
│   │   ├── Login.tsx
│   │   └── ...
│   ├── constants.tsx
│   └── types.ts
├── components/             # Reusable components
│   ├── Header.tsx
│   └── Footer.tsx
├── App.tsx                 # Main app component
├── package.json
├── tsconfig.json
├── vite.config.ts
└── script.sql             # Database initialization script
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v16+ recommended) - [Download](https://nodejs.org/)
- **Go** (v1.20+) - [Download](https://golang.org/dl/)
- **XAMPP** or MySQL Server - [Download XAMPP](https://www.apachefriends.org/)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd DB_Group1
```

### Step 2: Setup MySQL Database

#### Option A: Using XAMPP (Recommended)

1. **Start XAMPP Control Panel**
   - Open XAMPP Control Panel
   - Click "Start" for Apache and MySQL

2. **Create Database from Script**
   - Open phpMyAdmin: `http://localhost/phpmyadmin`
   - Click "New" in the left sidebar
   - Enter database name: `food_delivery_db`
   - Click "Create"
   - Select the new `food_delivery_db` database
   - Go to "SQL" tab
   - Copy & paste contents of `script.sql`
   - Click "Go" to execute

#### Option B: Using MySQL Command Line

```bash
# Login to MySQL
mysql -u root -p

# Run the script
source /path/to/script.sql

# Or copy-paste the entire script.sql contents
```

**Verify Database Creation:**
```bash
mysql -u root -p -e "SHOW DATABASES; USE food_delivery_db; SHOW TABLES;"
```

### Step 3: Configure Backend Connection

Edit `Go_api/storage.go` and ensure MySQL connection uses correct credentials:

```go
// Line ~15 in storage.go
func NewDB() (*database, error) {
	db, err := sql.Open("mysql", "root:@tcp(127.0.0.1:3306)/food_delivery_db")
	// root = MySQL username (default)
	// (empty) = MySQL password (default for XAMPP)
	// 127.0.0.1:3306 = MySQL host and port
	// food_delivery_db = Database name
}
```

### Step 4: Start the Backend

```bash
cd Go_api

# Download Go dependencies (first time only)
go mod download

# Build the server
go build -o server .

# Run the server
./server
# or on Windows:
server.exe
```

**Expected Output:**
```
✅ Successfully connected to MySQL database!
[GIN-debug] Listening and serving HTTP on :6969
```

The backend API is now running on `http://localhost:6969`

### Step 5: Install Frontend Dependencies

```bash
# From project root (DB_Group1/)
npm install
```

### Step 6: Start the Frontend Development Server

```bash
npm run dev
```

**Expected Output:**
```
VITE v6.2.0  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

Visit `http://localhost:5173` in your browser to access the app!

## 📝 Database Schema

### Customers Table
```sql
customer_id (PK) | name | email (UNIQUE) | password (hashed) | phone | created_at
```

### Restaurants Table
```sql
restaurant_id (PK) | name | address | opening_hours | phone | image | created_at | is_active
```

### Dishes Table
```sql
dish_id (PK) | restaurant_id (FK) | name | description | price | image | is_available | category
```

### Orders Table
```sql
order_id (PK) | customer_id (FK) | restaurant_id (FK) | delivery_person_id (FK) | status | total_amount | delivery_address | created_at
```

### Order Items Table
```sql
order_id (FK) | dish_id (FK) | quantity | subtotal | unit_price
```

## 🔑 API Endpoints

### Authentication
- `POST /signin` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /auth/check` - Verify session

### Menu & Restaurants
- `GET /home` - Get all dishes with categories
- `GET /restaurant` - Get all restaurants

### Protected Routes (Requires Authentication)
- `GET /user/profile` - Get user profile
- `GET /user/orders` - Get user's order history
- `DELETE /user/orders/:id` - Delete order (only if Pending)
- `PUT /user/orders/:id` - Update order address (only if Pending)

## 🧪 Test Accounts

The database is pre-populated with test data:

**Test Restaurant Data:**
- Burger Palace, Sushi & Roll, Pizza Heaven, Thai Street, Pasta Italiano, Chicken Express

**Test Customers:**
- Email: `john@example.com` / Password: `password123`
- Email: `jane@example.com` / Password: `password123`
- Email: `mike@example.com` / Password: `password123`

## 🔐 Security Features

✅ **Password Hashing**
- Passwords are hashed using bcrypt with salt rounds

✅ **JWT Authentication**
- 2-minute token expiration
- HTTP-only cookies (CSRF protection)
- Automatic session validation on page load

✅ **Protected Routes**
- Cart & checkout require authentication
- Orders page shows only user's orders
- Profile page restricted to authenticated users

✅ **CORS Configuration**
- Allows requests from: localhost:3000, localhost:3001, 127.0.0.1:3001

## 🐛 Troubleshooting

### Backend Issues

**Error: "connection refused"**
```
Solution: Ensure MySQL is running in XAMPP
- Open XAMPP Control Panel and click "Start" for MySQL
```

**Error: "Unknown column 'image' in field list"**
```
Solution: Database schema is outdated
- Drop and recreate the database using script.sql
```

**Error: "Port 6969 already in use"**
```bash
# Kill process using port 6969
lsof -ti:6969 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :6969    # Windows
```

### Frontend Issues

**Error: "API failed: 401"**
```
Solution: Session expired or invalid token
- Logout and login again
- Check browser cookies (DevTools > Application > Cookies)
```

**Error: "Cannot read property 'isLoggedIn' of undefined"**
```
Solution: AuthContext not initialized
- Check that App.tsx wraps components with AuthProvider and CartProvider
```

**Blank page or styles not loading**
```
Solution: Clear cache and rebuild
- Delete node_modules and package-lock.json
- Run: npm install && npm run dev
```

## 📊 Database Queries Reference

### Get All Restaurants with Dish Count
```sql
SELECT r.restaurant_id, r.name, COUNT(d.dish_id) as dish_count
FROM restaurants r
LEFT JOIN dishes d ON r.restaurant_id = d.restaurant_id
GROUP BY r.restaurant_id;
```

### Get Orders by Customer
```sql
SELECT * FROM orders 
WHERE customer_id = ? 
ORDER BY created_at DESC;
```

### Get Dishes by Restaurant
```sql
SELECT * FROM dishes 
WHERE restaurant_id = ? AND is_available = TRUE
ORDER BY category;
```

## 🎨 Environment Configuration

### Frontend (.env)
```
VITE_API_URL=http://localhost:6969
```

### Backend (storage.go)
```go
// MySQL Connection String
DSN: "root:@tcp(127.0.0.1:3306)/food_delivery_db"
```

## 📱 Responsive Design

The app is fully responsive:
- **Desktop:** Grid layouts with 3-4 columns
- **Tablet:** 2-column layouts
- **Mobile:** Single column with optimized touch targets

## 🔄 Deployment Considerations

For production deployment:

1. **Change MySQL Connection**
   - Update `storage.go` to use production database credentials
   - Use environment variables: `DB_USER`, `DB_PASS`, `DB_HOST`

2. **Update CORS Settings**
   - Modify `server.go` to allow production domain

3. **Change JWT Secret**
   - Update `secret` constant in `server.go` to a secure random string

4. **Build Frontend for Production**
   ```bash
   npm run build
   ```

5. **Use HTTPS**
   - Install SSL certificate
   - Update all API calls to use HTTPS

## 📝 License

This project is provided as-is for educational purposes.

## 🤝 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review server logs in `/tmp/go-server.log`
3. Check browser console (F12) for frontend errors

---

**Happy Ordering! 🍔🍕🍜**
