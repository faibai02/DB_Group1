<?php
require_once __DIR__ . "/connect_database.php";

try {
    $database = new FoodDeliveryDatabase();
    $db = $database->connect();
    
    // Update categories with images from Unsplash
    $updates = [
        1 => 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&fm=jpg&q=60&w=1200',
        2 => 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&fm=jpg&q=60&w=1200',
        3 => 'https://images.unsplash.com/photo-1548365328-8b849e6f3a3a?auto=format&fit=crop&fm=jpg&q=60&w=1200',
        4 => 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&fm=jpg&q=60&w=1200',
        5 => 'https://images.unsplash.com/photo-1521389508051-d7ffb5dc8b7a?auto=format&fit=crop&fm=jpg&q=60&w=1200',
        6 => 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&fm=jpg&q=60&w=1200',
        7 => 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&fm=jpg&q=60&w=1200',
        8 => 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&fm=jpg&q=60&w=1200',
        9 => 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&fm=jpg&q=60&w=1200'
    ];
    
    foreach ($updates as $category_id => $image) {
        $sql = "UPDATE categories SET image = ? WHERE category_id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$image, $category_id]);
    }
    
    echo json_encode(['success' => true, 'message' => 'Categories updated with images']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
