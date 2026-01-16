-- Création de la base de données
CREATE DATABASE IF NOT EXISTS food_delivery_db;
USE food_delivery_db;

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
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
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
    image VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    category VARCHAR(50),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
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

-- ===== INSERTION DE DONNÉES RÉALISTES =====

-- Restaurants
INSERT INTO restaurants (name, address, opening_hours, phone, image) VALUES 
('Burger Palace', '123 Main Street', '09:00 - 23:00', '+1-555-0101', 'https://picsum.photos/400/300?random=1'),
('Sushi & Roll', '456 Oak Avenue', '11:00 - 22:00', '+1-555-0102', 'https://picsum.photos/400/300?random=2'),
('Pizza Heaven', '789 Pine Road', '10:00 - 00:00', '+1-555-0103', 'https://picsum.photos/400/300?random=3'),
('Thai Street', '321 Elm Street', '11:30 - 23:30', '+1-555-0104', 'https://picsum.photos/400/300?random=4'),
('Pasta Italiano', '654 Maple Drive', '12:00 - 23:00', '+1-555-0105', 'https://picsum.photos/400/300?random=5'),
('Chicken Express', '987 Cedar Lane', '09:30 - 23:00', '+1-555-0106', 'https://picsum.photos/400/300?random=6');

-- Dishes for Burger Palace
INSERT INTO dishes (restaurant_id, name, description, price, image, category, is_available) VALUES 
(1, 'Classic Cheeseburger', 'Juicy beef patty with melted cheddar cheese', 9.99, 'https://picsum.photos/300/200?random=10', 'Burger', TRUE),
(1, 'Bacon Deluxe', 'Double patty with crispy bacon and special sauce', 12.99, 'https://picsum.photos/300/200?random=11', 'Burger', TRUE),
(1, 'Mushroom Swiss', 'Seasoned beef with mushrooms and Swiss cheese', 10.99, 'https://picsum.photos/300/200?random=12', 'Burger', TRUE),
(1, 'Crispy Fries', 'Golden fried potatoes with sea salt', 3.49, 'https://picsum.photos/300/200?random=13', 'Side', TRUE),
(1, 'Chocolate Milkshake', 'Thick and creamy chocolate shake', 4.99, 'https://picsum.photos/300/200?random=14', 'Beverage', TRUE);

-- Dishes for Sushi & Roll
INSERT INTO dishes (restaurant_id, name, description, price, image, category, is_available) VALUES 
(2, 'California Roll', 'Crab, avocado, cucumber with rice', 8.99, 'https://picsum.photos/300/200?random=20', 'Sushi', TRUE),
(2, 'Spicy Tuna Roll', 'Spicy tuna with jalapeño and sriracha', 9.99, 'https://picsum.photos/300/200?random=21', 'Sushi', TRUE),
(2, 'Dragon Roll', 'Shrimp tempura with eel and avocado', 14.99, 'https://picsum.photos/300/200?random=22', 'Sushi', TRUE),
(2, 'Edamame', 'Steamed soybean pods with sea salt', 4.99, 'https://picsum.photos/300/200?random=23', 'Appetizer', TRUE),
(2, 'Miso Soup', 'Traditional Japanese soybean soup', 3.49, 'https://picsum.photos/300/200?random=24', 'Soup', TRUE);

-- Dishes for Pizza Heaven
INSERT INTO dishes (restaurant_id, name, description, price, image, category, is_available) VALUES 
(3, 'Margherita Pizza', 'Fresh mozzarella, tomato, basil and olive oil', 11.99, 'https://picsum.photos/300/200?random=30', 'Pizza', TRUE),
(3, 'Pepperoni Feast', 'Loaded with pepperoni and mozzarella', 13.99, 'https://picsum.photos/300/200?random=31', 'Pizza', TRUE),
(3, 'Veggie Delight', 'Mushrooms, peppers, onions, olives', 12.99, 'https://picsum.photos/300/200?random=32', 'Pizza', TRUE),
(3, 'Garlic Bread', 'Toasted bread with garlic butter', 4.49, 'https://picsum.photos/300/200?random=33', 'Side', TRUE),
(3, 'Tiramisu', 'Classic Italian dessert with cocoa', 5.99, 'https://picsum.photos/300/200?random=34', 'Dessert', TRUE);

-- Dishes for Thai Street
INSERT INTO dishes (restaurant_id, name, description, price, image, category, is_available) VALUES 
(4, 'Pad Thai', 'Stir-fried rice noodles with shrimp and peanuts', 10.99, 'https://picsum.photos/300/200?random=40', 'Noodles', TRUE),
(4, 'Green Curry Chicken', 'Spicy green curry with basil and chicken', 11.99, 'https://picsum.photos/300/200?random=41', 'Curry', TRUE),
(4, 'Tom Yum Soup', 'Spicy and sour soup with shrimp', 8.99, 'https://picsum.photos/300/200?random=42', 'Soup', TRUE),
(4, 'Spring Rolls', 'Fresh vegetables wrapped in rice paper', 5.99, 'https://picsum.photos/300/200?random=43', 'Appetizer', TRUE),
(4, 'Mango Sticky Rice', 'Sweet rice with fresh mango and coconut', 6.99, 'https://picsum.photos/300/200?random=44', 'Dessert', TRUE);

-- Dishes for Pasta Italiano
INSERT INTO dishes (restaurant_id, name, description, price, image, category, is_available) VALUES 
(5, 'Spaghetti Carbonara', 'Creamy pasta with bacon and parmesan', 12.99, 'https://picsum.photos/300/200?random=50', 'Pasta', TRUE),
(5, 'Fettuccine Alfredo', 'Rich and creamy alfredo sauce with fettuccine', 11.99, 'https://picsum.photos/300/200?random=51', 'Pasta', TRUE),
(5, 'Lasagna Bolognese', 'Layered pasta with meat sauce and cheese', 13.99, 'https://picsum.photos/300/200?random=52', 'Pasta', TRUE),
(5, 'Caprese Salad', 'Fresh mozzarella, tomato, and basil', 8.99, 'https://picsum.photos/300/200?random=53', 'Salad', TRUE),
(5, 'Panna Cotta', 'Silky Italian cream dessert with berries', 6.99, 'https://picsum.photos/300/200?random=54', 'Dessert', TRUE);

-- Dishes for Chicken Express
INSERT INTO dishes (restaurant_id, name, description, price, image, category, is_available) VALUES 
(6, 'Crispy Fried Chicken', 'Golden fried chicken with herbs', 9.99, 'https://picsum.photos/300/200?random=60', 'Chicken', TRUE),
(6, 'Grilled Chicken Breast', 'Tender grilled chicken with seasonal vegetables', 10.99, 'https://picsum.photos/300/200?random=61', 'Chicken', TRUE),
(6, 'Spicy Buffalo Wings', 'Hot and tangy buffalo sauce wings', 8.99, 'https://picsum.photos/300/200?random=62', 'Wings', TRUE),
(6, 'Chicken Salad', 'Fresh greens with grilled chicken strips', 9.99, 'https://picsum.photos/300/200?random=63', 'Salad', TRUE),
(6, 'Mac & Cheese', 'Creamy macaroni with cheddar cheese', 6.99, 'https://picsum.photos/300/200?random=64', 'Side', TRUE);

-- Test Customers
INSERT INTO customers (name, email, password) VALUES 
('John Doe', 'john@example.com', '$2a$10$YourHashedPasswordHere'),
('Jane Smith', 'jane@example.com', '$2a$10$YourHashedPasswordHere'),
('Mike Johnson', 'mike@example.com', '$2a$10$YourHashedPasswordHere');

-- Test Delivery Persons
INSERT INTO delivery_persons (name, phone, vehicle_type) VALUES 
('Alex Rodriguez', '555-0201', 'Bike'),
('Lisa Chen', '555-0202', 'Motorcycle'),
('James Wilson', '555-0203', 'Scooter');
