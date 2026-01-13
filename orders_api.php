<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit();
}

require_once __DIR__ . "/connect_database.php";

try {
  $database = new FoodDeliveryDatabase();
  $db = $database->connect();

  // Get orders for a customer
  if (isset($_GET['customer_id'])) {
    $customer_id = $_GET['customer_id'];
    
    $sql = "
      SELECT 
        o.order_id,
        o.customer_id,
        o.restaurant_id,
        r.name AS restaurant,
        o.status,
        o.total_amount,
        o.created_at,
        COUNT(oi.dish_id) AS item_count
      FROM orders o
      LEFT JOIN restaurants r ON r.restaurant_id = o.restaurant_id
      LEFT JOIN order_item oi ON oi.order_id = o.order_id
      WHERE o.customer_id = ?
      GROUP BY o.order_id, o.customer_id, o.restaurant_id, r.name, o.status, o.total_amount, o.created_at
      ORDER BY o.created_at DESC
    ";
    
    $stmt = $db->prepare($sql);
    $stmt->execute([$customer_id]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($rows);
    exit();
  }

  // Get order details with items
  if (isset($_GET['order_id'])) {
    $order_id = $_GET['order_id'];
    
    $sql = "
      SELECT 
        o.order_id,
        o.customer_id,
        o.restaurant_id,
        r.name AS restaurant,
        o.status,
        o.total_amount,
        o.delivery_address,
        o.created_at,
        oi.dish_id,
        d.name AS dish_name,
        oi.quantity,
        oi.unit_price,
        oi.subtotal
      FROM orders o
      LEFT JOIN restaurants r ON r.restaurant_id = o.restaurant_id
      LEFT JOIN order_item oi ON oi.order_id = o.order_id
      LEFT JOIN dishes d ON d.dish_id = oi.dish_id
      WHERE o.order_id = ?
    ";
    
    $stmt = $db->prepare($sql);
    $stmt->execute([$order_id]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($rows);
    exit();
  }

  http_response_code(400);
  echo json_encode(["error" => "Missing customer_id or order_id parameter"]);

} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["error" => $e->getMessage()]);
}
