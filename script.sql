-- Création de la base de données
CREATE DATABASE IF NOT EXISTS foodie_db;
USE foodie_db;

-- Table des Clients
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des Restaurants
CREATE TABLE restaurants (
    restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    opening_hours VARCHAR(100),
    phone VARCHAR(20),
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Table des Catégories de Plats
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    image VARCHAR(500)
);

-- Table des Livreurs
CREATE TABLE delivery_persons (
    delivery_person_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    vehicle_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des Plats (Dishes)
CREATE TABLE dishes (
    dish_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    category_id INT NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Table des Commandes (Orders)
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    delivery_person_id INT,
    status VARCHAR(50) DEFAULT 'Pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id),
    FOREIGN KEY (delivery_person_id) REFERENCES delivery_persons(delivery_person_id)
);

-- Table des Items de commande
CREATE TABLE order_item (
    order_id INT NOT NULL,
    dish_id INT NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (order_id, dish_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes(dish_id)
);

-- Table des Messages (Chat)
CREATE TABLE chat_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    send_id INT NOT NULL,
    sender_type VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- =========================
-- INSERTION DES DONNÉES
-- =========================

-- Categories
INSERT INTO categories (name, description, image) VALUES
('Burger', 'Burgers and sandwiches',
 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&h=800&q=80'),

('Sushi', 'Sushi and sashimi specialties',
 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&h=800&q=80'),

('Pizza', 'Oven-baked pizzas',
 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=1200&h=800&q=80'),

('Noodles', 'Noodles and stir-fried dishes',
 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=1200&h=800&q=80'),

('Pasta', 'Fresh Italian-style pasta',
 'https://images.unsplash.com/photo-1764586119076-61711e8ed25a?auto=format&fit=crop&fm=jpg&q=60&w=1200'),

('Chicken', 'Chicken-based dishes',
 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=1200&h=800&q=80'),

('Side', 'Side dishes',
 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&h=800&q=80'),

('Appetizer', 'Starters and appetizers',
 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&h=800&q=80'),

('Dessert', 'Desserts',
 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&h=800&q=80');


-- Restaurants
INSERT INTO restaurants (name, address, opening_hours, phone, image) VALUES 
('Burger Palace', '123 Main Street', '09:00 - 23:00', '+1-555-0101',
 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&h=800&q=80'),

('Sushi & Roll', '456 Oak Avenue', '11:00 - 22:00', '+1-555-0102',
 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&h=800&q=80'),

('Pizza Heaven', '789 Pine Road', '10:00 - 00:00', '+1-555-0103',
 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=1200&h=800&q=80'),

('Thai Street', '321 Elm Street', '11:30 - 23:30', '+1-555-0104',
 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&h=800&q=80'),

('Pasta Italiano', '654 Maple Drive', '12:00 - 23:00', '+1-555-0105',
 'https://images.unsplash.com/photo-1764586119076-61711e8ed25a?auto=format&fit=crop&w=1200&h=800&q=80'),

('Chicken Express', '987 Cedar Lane', '09:30 - 23:00', '+1-555-0106',
 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=1200&h=800&q=80');

-- =========================
-- DISHES : Burger Palace
-- =========================
INSERT INTO dishes (restaurant_id, name, description, price, image, category_id, is_available) VALUES
(1, 'Classic Cheeseburger', 'Juicy beef patty with melted cheddar cheese.', 9.99,
 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&fm=jpg&q=60&w=1200',
 (SELECT category_id FROM categories WHERE name='Burger'), TRUE),

(1, 'Bacon Deluxe Burger', 'Double patty with crispy bacon and house sauce.', 12.99,
 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&fm=jpg&q=60&w=1200',
 (SELECT category_id FROM categories WHERE name='Burger'), TRUE),

(1, 'Mushroom Swiss Burger', 'Seasoned beef with sautéed mushrooms and Swiss cheese.', 10.99,
 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&fm=jpg&q=60&w=1200',
 (SELECT category_id FROM categories WHERE name='Burger'), TRUE),

(1, 'Crispy Fries', 'Golden fries sprinkled with sea salt.', 3.49,
 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&fm=jpg&q=60&w=1200',
 (SELECT category_id FROM categories WHERE name='Side'), TRUE),

(1, 'Chocolate Milkshake', 'Thick, creamy chocolate milkshake.', 4.99,
 'https://images.unsplash.com/photo-1556722283-71e39f3077b1?auto=format&fit=crop&fm=jpg&q=60&w=1200',
 (SELECT category_id FROM categories WHERE name='Dessert'), TRUE);

-- =========================
-- DISHES : Sushi & Roll
-- =========================
INSERT INTO dishes (restaurant_id, name, description, price, image, category_id, is_available) VALUES
(2, 'California Roll', 'Crab, avocado, and cucumber rolled with rice.', 8.99,
 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&fm=jpg&q=60&w=1200',
 (SELECT category_id FROM categories WHERE name='Sushi'), TRUE),

(2, 'Spicy Tuna Roll', 'Tuna with spicy mayo, chili, and sesame.', 9.99,
 'https://images.unsplash.com/photo-1555341748-a9d443dc3c14?auto=format&fit=crop&fm=jpg&q=60&w=1200',
 (SELECT category_id FROM categories WHERE name='Sushi'), TRUE),

(2, 'Dragon Roll', 'Shrimp tempura, eel sauce, and avocado.', 14.99,
 'https://images.unsplash.com/photo-1712192674556-4a89f20240c1?auto=format&fit=crop&fm=jpg&q=60&w=1200',
 (SELECT category_id FROM categories WHERE name='Sushi'), TRUE),

(2, 'Edamame', 'Steamed edamame sprinkled with sea salt.', 4.99,
 'https://images.unsplash.com/photo-1611810174991-5cdd99a2c6b2?auto=format&fit=crop&fm=jpg&q=60&w=1200',
 (SELECT category_id FROM categories WHERE name='Appetizer'), TRUE);

-- =========================
-- DISHES : Pizza Heaven
-- =========================
INSERT INTO dishes (restaurant_id, name, description, price, image, category_id, is_available) VALUES
(3, 'Margherita Pizza', 'Fresh mozzarella, tomato sauce, basil, and olive oil.', 11.99,
 'https://images.unsplash.com/photo-1664309641932-0e03e0771b97?auto=format&fit=crop&fm=jpg&q=60&w=1200',
 (SELECT category_id FROM categories WHERE name='Pizza'), TRUE),

(3, 'Pepperoni Pizza', 'Loaded with pepperoni and mozzarella.', 13.99,
 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&fm=jpg&q=60&w=1200',
 (SELECT category_id FROM categories WHERE name='Pizza'), TRUE);

-- =========================
-- DISHES : Thai Street
-- =========================
INSERT INTO dishes (restaurant_id, name, description, price, image, category_id, is_available) VALUES
(4, 'Green Curry Chicken', 'Spicy green curry with basil and tender chicken.', 11.99,
 'https://images.unsplash.com/photo-1761315414522-a732eb715497?auto=format&fit=crop&fm=jpg&q=60&w=1200',
 (SELECT category_id FROM categories WHERE name='Chicken'), TRUE);

-- =========================
-- DISHES : Pasta Italiano
-- =========================
INSERT INTO dishes (restaurant_id, name, description, price, image, category_id, is_available) VALUES
(5, 'Spaghetti Carbonara', 'Creamy sauce with pancetta, egg, and parmesan.', 12.99,
 'https://images.unsplash.com/photo-1764586119076-61711e8ed25a?auto=format&fit=crop&fm=jpg&q=60&w=1200',
 (SELECT category_id FROM categories WHERE name='Pasta'), TRUE);

-- =========================
-- DISHES : Chicken Express
-- =========================
INSERT INTO dishes (restaurant_id, name, description, price, image, category_id, is_available) VALUES
(6, 'Crispy Fried Chicken', 'Golden fried chicken seasoned with herbs and spices.', 9.99,
 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&fm=jpg&q=60&w=1200',
 (SELECT category_id FROM categories WHERE name='Chicken'), TRUE),

(6, 'Grilled Chicken Breast', 'Tender grilled chicken served with seasonal vegetables.', 10.99,
 'https://images.unsplash.com/photo-1762631383520-df106b252f6a?auto=format&fit=crop&fm=jpg&q=60&w=1200',
 (SELECT category_id FROM categories WHERE name='Chicken'), TRUE);

-- =========================
-- CUSTOMERS
-- =========================
INSERT INTO customers (name, email, password, phone) VALUES
('John Doe', 'john@example.com', '$2a$10$YourHashedPasswordHere', '555-1001'),
('Jane Smith', 'jane@example.com', '$2a$10$YourHashedPasswordHere', '555-1002'),
('Mike Johnson', 'mike@example.com', '$2a$10$YourHashedPasswordHere', '555-1003');

-- =========================
-- DELIVERY PERSONS
-- =========================
INSERT INTO delivery_persons (name, phone, email, vehicle_type) VALUES
('Alex Rodriguez', '555-0201', 'alex@delivery.com', 'Bike'),
('Lisa Chen', '555-0202', 'lisa@delivery.com', 'Motorcycle'),
('James Wilson', '555-0203', 'james@delivery.com', 'Scooter');
