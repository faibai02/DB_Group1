<?php

class FoodDeliveryDatabase {
    private $host = "localhost";
    private $db_name = "food_delivery_db";
    private $username = "root";
    private $password = "";
    public $conn;

    public function connect() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}

class Customer {
    private $conn;
    private $table = "customers";

    public function __construct($db) { $this->conn = $db; }

    public function getById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE customer_id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addToDatabase($name, $email, $password, $phone) {
        $query = "INSERT INTO " . $this->table . " (name, email, password, phone) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT), $phone]);
    }
}

class Restaurant {
    private $conn;
    private $table = "restaurants";

    public function __construct($db) { $this->conn = $db; }

    public function getById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE restaurant_id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addToDatabase($name, $address, $opening_hours, $phone) {
        $query = "INSERT INTO " . $this->table . " (name, address, opening_hours, phone) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$name, $address, $opening_hours, $phone]);
    }

    public function getAll() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

class DeliveryPerson {
    private $conn;
    private $table = "delivery_persons";

    public function __construct($db) { $this->conn = $db; }

    public function getById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE delivery_person_id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addToDatabase($name, $phone, $email, $vehicle_type) {
        $query = "INSERT INTO " . $this->table . " (name, phone, email, vehicle_type) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$name, $phone, $email, $vehicle_type]);
    }
}

class Dish {
    private $conn;
    private $table = "dishes";

    public function __construct($db) { $this->conn = $db; }

    public function getById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE dish_id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addToDatabase($restaurant_id, $name, $description, $price, $category) {
        $query = "INSERT INTO " . $this->table . " (restaurant_id, name, description, price, category) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$restaurant_id, $name, $description, $price, $category]);
    }
}

class Order {
    private $conn;
    private $table = "orders";

    public function __construct($db) { $this->conn = $db; }

    public function getById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE order_id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addToDatabase($customer_id, $restaurant_id, $total, $address) {
        $query = "INSERT INTO " . $this->table . " (customer_id, restaurant_id, total_amount, delivery_address) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$customer_id, $restaurant_id, $total, $address]);
        return $this->conn->lastInsertId();
    }
}

class OrderItem {
    private $conn;
    private $table = "order_item";

    public function __construct($db) { $this->conn = $db; }

    public function getById($order_id, $dish_id) {
        $query = "SELECT * FROM " . $this->table . " WHERE order_id = ? AND dish_id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$order_id, $dish_id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addToDatabase($order_id, $dish_id, $qty, $unit_price) {
        $subtotal = $qty * $unit_price;
        $query = "INSERT INTO " . $this->table . " (order_id, dish_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$order_id, $dish_id, $qty, $unit_price, $subtotal]);
    }
}

class ChatMessage {
    private $conn;
    private $table = "chat_messages";

    public function __construct($db) { $this->conn = $db; }

    public function getById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE message_id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addToDatabase($order_id, $send_id, $sender_type, $content) {
        $query = "INSERT INTO " . $this->table . " (order_id, send_id, sender_type, content) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$order_id, $send_id, $sender_type, $content]);
    }
}

?>