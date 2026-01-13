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

  // Handle POST request to create an order
  if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (!$input) {
      http_response_code(400);
      echo json_encode(["error" => "Invalid JSON"]);
      exit();
    }

    // Validate required fields
    if (!isset($input['customer_id']) || !isset($input['restaurant_id']) || 
        !isset($input['total_amount']) || !isset($input['items'])) {
      http_response_code(400);
      echo json_encode(["error" => "Missing required fields: customer_id, restaurant_id, total_amount, items"]);
      exit();
    }

    // Start transaction
    $db->beginTransaction();

    try {
      // Create order
      $orderClass = new Order($db);
      $orderId = $orderClass->addToDatabase(
        $input['customer_id'],
        $input['restaurant_id'],
        $input['total_amount'],
        $input['delivery_address'] ?? null
      );

      // Add order items
      $orderItemClass = new OrderItem($db);
      foreach ($input['items'] as $item) {
        if (!isset($item['dish_id']) || !isset($item['quantity']) || !isset($item['unit_price'])) {
          throw new Exception("Invalid item data");
        }
        
        $orderItemClass->addToDatabase(
          $orderId,
          $item['dish_id'],
          $item['quantity'],
          $item['unit_price']
        );
      }

      // Commit transaction
      $db->commit();

      http_response_code(201);
      echo json_encode([
        "success" => true,
        "order_id" => $orderId,
        "message" => "Order created successfully"
      ]);
    } catch (Exception $e) {
      $db->rollBack();
      throw $e;
    }

    exit();
  }

  // Default GET request - Return menu items (dishes joined with restaurant)
  $sql = "
    SELECT
      d.dish_id,
      d.name,
      COALESCE(d.description, '') AS description,
      d.price,
      COALESCE(d.category, '') AS category,
      r.name AS restaurant,
      r.restaurant_id
    FROM dishes d
    JOIN restaurants r ON r.restaurant_id = d.restaurant_id
  ";

  $stmt = $db->prepare($sql);
  $stmt->execute();
  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($rows);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["error" => $e->getMessage()]);
}
