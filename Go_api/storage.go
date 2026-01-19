package main

import (
	"database/sql"
	"github.com/go-sql-driver/mysql"
	"time"
	"errors"
	"log"
	"golang.org/x/crypto/bcrypt"
	
)



// for db related stuff 
// include type for each table and function
// Type for each table in the db
type customers struct {
	ID int `json:"customer_id"`
	Name string `json:"name"`
	Email string `json:"email"`
	Pass string  `json:"password"`
	Phone string `json:"phone_number"`
	created time.Time
}
type chat_messages struct {
	ID int `json:"message_id"`
	Order_id int `json:"order_id"`
	Send_id int `json:"send_id"`
	Sender_type string `json:"sender"`
	Content string `json:"content"`
	send_at time.Time
}
type courier struct {
	ID int `json:"courier_id"`
	Name string `json:"courier_name"`
	Phone string `json:"phone_number"`
	Email string `json:"email"`
	Vehicle string `json:"vehicle_type"`
	Active bool `json:"is_active"`
	created time.Time
}
type dishes struct {
	ID int `json:"id"`
	Rest_id int `json:"restaurant_id"`
	Name string `json:"name"`
	Description string `json:"description"`
	Price float32 `json:"price"`
	Image string `json:"image"`
	Available bool `json:"is_available"`
	Category string `json:"category"`
	RestaurantName string `json:"restaurant"`
}
type orders struct {
	ID int `json:"orders_id"`
	Cus_id int `json:"customer_id"`
	Rest_id int `json:"restaurant_id"`
	Courier_id int `json:"courier_id"`
	Status string `json:"status"`
	Total float64 `json:"total_amount"`
	Deliver_address string `json:"delivery_address"`
	Created time.Time `json:"created_at"`
}
type order_item struct {
	ID int `json:"order_item_id"`
	Dish_id int `json:"dish_id"`
	Quantity int `json:"quantity"`
	Total float64 `json:"total"`
	Unit_price float32 `json:"unit_price"`
}
type restaurant struct {
	ID int `json:"restaurant_id"`
	Name string `json:"name"`
	Address string `json:"address"`
	Opening_time string `json:"opening_hour"`
	Phone string `json:"restaurant_phone"`
	Image string `json:"image"`
	created time.Time
	Active bool `json:"is_active"`
}

type category struct {
	ID int `json:"category_id"`
	Name string `json:"name"`
	Description string `json:"description"`
	Image string `json:"image"`
}

// type for database struct (to use method and stuff)
type database struct{
	db *sql.DB
}

//function
func NewDB() (*database,error){

	cfg := mysql.NewConfig()
	cfg.User = "root"
	cfg.Passwd = ""
	cfg.Net = "tcp"
	cfg.Addr = "127.0.0.1:3306"
	cfg.DBName = "foodie_db"  // Changed from "mysql" to the correct database
	cfg.ParseTime = true


	db, err := sql.Open("mysql",cfg.FormatDSN())

	if err != nil {
		return nil,err
	}
	// connection
	if err:= db.Ping(); err != nil{
		return nil,err
	}

	return &database{
		db:db,
	},err
}
// get all restaurant in the db 
func (d *database) GetRest() ([]*restaurant,error){
	rest_group := []*restaurant{}
	// Use COALESCE to handle NULL values
	query:= `SELECT restaurant_id, name, 
	         COALESCE(address, '') as address, 
	         COALESCE(opening_hours, '') as opening_hours, 
	         COALESCE(phone, '') as phone, 
	         is_active,
	         COALESCE(image, '') as image
	         FROM foodie_db.restaurants`
	rows,err := d.db.Query(query)
	if err != nil {
		log.Printf("Query error: %v", err)
		return nil,err
	}
	defer rows.Close()
	
	for rows.Next() {
		var rest = restaurant{}
		if err := rows.Scan(&rest.ID,&rest.Name,&rest.Address,&rest.Opening_time,&rest.Phone,&rest.Active,&rest.Image); err != nil {
			log.Printf("Scan error: %v", err)
			return nil,err
		}
		rest_group = append(rest_group,&rest)
	}
	
	return rest_group,nil
}

// get all categories from the db
func (d *database) GetCategories() ([]*category, error) {
	categories := []*category{}
	query := `SELECT category_id, name, 
	         COALESCE(description, '') as description, 
	         COALESCE(image, '') as image
	         FROM foodie_db.categories`
	rows, err := d.db.Query(query)
	if err != nil {
		log.Printf("Query error: %v", err)
		return nil, err
	}
	defer rows.Close()
	
	for rows.Next() {
		var cat = category{}
		if err := rows.Scan(&cat.ID, &cat.Name, &cat.Description, &cat.Image); err != nil {
			log.Printf("Scan error: %v", err)
			return nil, err
		}
		categories = append(categories, &cat)
	}
	
	return categories, nil
}

// to check uniqueness before signin
func (d *database) CheckAndStoreUser(cus customers) error {
	check_unique := `SELECT EXISTS(SELECT 1 FROM foodie_db.customers WHERE email = ?)`
	insert := `INSERT INTO foodie_db.customers(customer_id,name,email,password,phone) VALUES(?,?,?,?,?)`
	var already_exist bool

	row := d.db.QueryRow(check_unique,cus.Email)
	if err := row.Scan(&already_exist);err != nil {
		return err
	}

	if already_exist {
		return errors.New("Email already been use") 
	}

	// Hash the password with bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(cus.Pass), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	_, err = d.db.Exec(insert,cus.ID,cus.Name,cus.Email,string(hashedPassword),cus.Phone)
	if err != nil {
		return err
	}
	return nil
}

// check login user
func (d *database) LoginChecker(body loginBody) (bool,error) {
	
	var sql_password string
	find_pass := `SELECT password FROM food_delivery_db.customers WHERE email = ?`
	row := d.db.QueryRow(find_pass,body.Email)

	if err := row.Scan(&sql_password); err != nil {
		return false,err
	}
	
	// Compare hashed password with bcrypt
	// I change it to time out system
	err := bcrypt.CompareHashAndPassword([]byte(sql_password), []byte(body.Pass))
	if err != nil {
		return false,nil
	}

	return true,nil
}
func (d *database) GetCustomer(email string) (*customers,error) {
	get_user := `SELECT * FROM foodie_db.customers WHERE email = ?`
	var sql_customer customers
	row := d.db.QueryRow(get_user,email)
	
	err := row.Scan(&sql_customer.ID,&sql_customer.Name,&sql_customer.Email,&sql_customer.Pass,&sql_customer.Phone,&sql_customer.created)
	if err != nil {
		return nil,err
	}
	

	return &sql_customer,nil
}
//get all dishes for home?
func (d *database) GetAllDishes() ([]*dishes,error) {
	var dishes_array []*dishes
	// Use COALESCE to handle NULL values by converting them to empty strings
	get_dishes := `SELECT d.dish_id, d.restaurant_id, d.name, 
	               COALESCE(d.description, '') as description, 
	               d.price, d.is_available, 
	               COALESCE(c.name, '') as category,
	               COALESCE(r.name, '') as restaurant_name,
	               COALESCE(d.image, '') as image
	               FROM foodie_db.dishes d
	               LEFT JOIN foodie_db.restaurants r ON d.restaurant_id = r.restaurant_id
	               LEFT JOIN foodie_db.categories c ON c.category_id = d.category_id`

	rows,err := d.db.Query(get_dishes)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var temp_dish dishes
		err := rows.Scan(&temp_dish.ID,&temp_dish.Rest_id,&temp_dish.Name,&temp_dish.Description,&temp_dish.Price,&temp_dish.Available,&temp_dish.Category,&temp_dish.RestaurantName,&temp_dish.Image)
		if err != nil {
			return nil,err
		}
		dishes_array = append(dishes_array,&temp_dish)
	}

	return dishes_array,nil
}

// Get orders for a specific customer
func (d *database) GetCustomerOrders(customerId int) ([]*orders, error) {
	var orders_array []*orders
	get_orders := `SELECT order_id, customer_id, restaurant_id, 
	               COALESCE(status, 'Pending') as status, 
	               total_amount, 
	               COALESCE(delivery_address, '') as delivery_address,
	               created_at
	               FROM foodie_db.orders
	               WHERE customer_id = ?
	               ORDER BY created_at DESC`

	rows, err := d.db.Query(get_orders, customerId)
	if err != nil {
		log.Printf("Query error: %v", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var temp_order orders
		err := rows.Scan(&temp_order.ID, &temp_order.Cus_id, &temp_order.Rest_id,
			&temp_order.Status, &temp_order.Total,
			&temp_order.Deliver_address, &temp_order.Created)
		if err != nil {
			log.Printf("Scan error: %v", err)
			return nil, err
		}
		orders_array = append(orders_array, &temp_order)
	}

	return orders_array, nil
}

// Delete order (only if status is Pending)
func (d *database) DeleteOrder(orderId int, customerId int) error {
	delete_order := `DELETE FROM foodie_db.orders 
	                 WHERE order_id = ? AND customer_id = ? AND status = 'Pending'`
	
	result, err := d.db.Exec(delete_order, orderId, customerId)
	if err != nil {
		log.Printf("Delete error: %v", err)
		return err
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rows == 0 {
		return &customError{message: "Order not found or cannot be deleted"}
	}
	
	return nil
}

// Update order delivery address (only if status is Pending)
func (d *database) UpdateOrderAddress(orderId int, customerId int, newAddress string) error {
	update_order := `UPDATE foodie_db.orders 
	                 SET delivery_address = ?
	                 WHERE order_id = ? AND customer_id = ? AND status = 'Pending'`
	
	result, err := d.db.Exec(update_order, newAddress, orderId, customerId)
	if err != nil {
		log.Printf("Update error: %v", err)
		return err
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rows == 0 {
		return &customError{message: "Order not found or cannot be updated"}
	}
	
	return nil
}

// Delete order item (only if status is Pending)
func (d *database) DeleteOrderItem(orderId int, customerId int, dishId int) error {
	// First verify the order belongs to the customer and is pending
	check_query := `SELECT status FROM foodie_db.orders 
	                WHERE order_id = ? AND customer_id = ?`
	
	var status string
	err := d.db.QueryRow(check_query, orderId, customerId).Scan(&status)
	if err != nil {
		return &customError{message: "Order not found"}
	}
	
	if status != "Pending" {
		return &customError{message: "Cannot modify non-pending orders"}
	}
	
	// Delete the item
	delete_query := `DELETE FROM foodie_db.order_item 
	                 WHERE order_id = ? AND dish_id = ?`
	
	result, err := d.db.Exec(delete_query, orderId, dishId)
	if err != nil {
		return err
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rows == 0 {
		return &customError{message: "Item not found in order"}
	}
	
	// Recalculate order total
	total_query := `SELECT SUM(subtotal) FROM foodie_db.order_item WHERE order_id = ?`
	var newTotal sql.NullFloat64
	err = d.db.QueryRow(total_query, orderId).Scan(&newTotal)
	if err != nil {
		return err
	}
	
	totalAmount := 0.0
	if newTotal.Valid {
		totalAmount = newTotal.Float64
	}
	
	// Update order total
	update_query := `UPDATE foodie_db.orders SET total_amount = ? WHERE order_id = ?`
	_, err = d.db.Exec(update_query, totalAmount, orderId)
	
	return err
}

// Update order item quantity (only if status is Pending)
func (d *database) UpdateOrderItemQuantity(orderId int, customerId int, dishId int, newQuantity int) error {
	// First verify the order belongs to the customer and is pending
	check_query := `SELECT status FROM foodie_db.orders 
	                WHERE order_id = ? AND customer_id = ?`
	
	var status string
	err := d.db.QueryRow(check_query, orderId, customerId).Scan(&status)
	if err != nil {
		return &customError{message: "Order not found"}
	}
	
	if status != "Pending" {
		return &customError{message: "Cannot modify non-pending orders"}
	}
	
	if newQuantity < 1 {
		return &customError{message: "Quantity must be at least 1"}
	}
	
	// Get unit price
	price_query := `SELECT unit_price FROM foodie_db.order_item WHERE order_id = ? AND dish_id = ?`
	var unitPrice float32
	err = d.db.QueryRow(price_query, orderId, dishId).Scan(&unitPrice)
	if err != nil {
		return &customError{message: "Item not found"}
	}
	
	newSubtotal := float64(unitPrice) * float64(newQuantity)
	
	// Update the item
	update_query := `UPDATE foodie_db.order_item 
	                 SET quantity = ?, subtotal = ? 
	                 WHERE order_id = ? AND dish_id = ?`
	
	result, err := d.db.Exec(update_query, newQuantity, newSubtotal, orderId, dishId)
	if err != nil {
		return err
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rows == 0 {
		return &customError{message: "Item not found"}
	}
	
	// Recalculate order total
	total_query := `SELECT SUM(subtotal) FROM foodie_db.order_item WHERE order_id = ?`
	var newTotal sql.NullFloat64
	err = d.db.QueryRow(total_query, orderId).Scan(&newTotal)
	if err != nil {
		return err
	}
	
	totalAmount := 0.0
	if newTotal.Valid {
		totalAmount = newTotal.Float64
	}
	
	// Update order total
	update_total := `UPDATE foodie_db.orders SET total_amount = ? WHERE order_id = ?`
	_, err = d.db.Exec(update_total, totalAmount, orderId)
	
	return err
}

// UpdateCustomerProfile updates customer name and email in the database
func (d *database) UpdateCustomerProfile(customerId int, name string, email string) error {
	query := `UPDATE customers SET name = ?, email = ? WHERE customer_id = ?`
	
	result, err := d.db.Exec(query, name, email, customerId)
	if err != nil {
		return err
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rows == 0 {
		return &customError{message: "Customer not found"}
	}
	
	return nil
}

// CreateOrder creates a new order with items
func (d *database) CreateOrder(customerId int, restaurantId int, totalAmount float64, deliveryAddress string, items []map[string]interface{}) (int, error) {
	// Insert order
	query := `INSERT INTO orders (customer_id, restaurant_id, total_amount, delivery_address, status) 
	          VALUES (?, ?, ?, ?, 'Pending')`
	
	result, err := d.db.Exec(query, customerId, restaurantId, totalAmount, deliveryAddress)
	if err != nil {
		return 0, err
	}
	
	orderId, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}
	
	// Insert order items
	itemQuery := `INSERT INTO order_item (order_id, dish_id, quantity, unit_price, subtotal) 
	             VALUES (?, ?, ?, ?, ?)`
	
	for _, item := range items {
		dishId := item["dish_id"].(float64)
		quantity := item["quantity"].(float64)
		unitPrice := item["unit_price"].(float64)
		subtotal := quantity * unitPrice
		
		_, err := d.db.Exec(itemQuery, orderId, int(dishId), int(quantity), unitPrice, subtotal)
		if err != nil {
			return 0, err
		}
	}
	
	return int(orderId), nil
}

// GetOrderDetail retrieves full order details including items and restaurant
type OrderDetailResponse struct {
	OrdersId int `json:"orders_id"`
	CustomerId int `json:"customer_id"`
	RestaurantId int `json:"restaurant_id"`
	RestaurantName string `json:"restaurant_name"`
	Status string `json:"status"`
	TotalAmount float64 `json:"total_amount"`
	DeliveryAddress string `json:"delivery_address"`
	CreatedAt time.Time `json:"created_at"`
	Items []OrderItemDetail `json:"items"`
}

type OrderItemDetail struct {
	DishId int `json:"dish_id"`
	DishName string `json:"dish_name"`
	Quantity int `json:"quantity"`
	UnitPrice float32 `json:"unit_price"`
	Subtotal float64 `json:"subtotal"`
}

func (d *database) GetOrderDetail(orderId int, customerId int) (*OrderDetailResponse, error) {
	// Get order details
	order_query := `SELECT o.order_id, o.customer_id, o.restaurant_id, r.name, o.status, 
	                       o.total_amount, o.delivery_address, o.created_at
	                FROM foodie_db.orders o
	                JOIN foodie_db.restaurants r ON o.restaurant_id = r.restaurant_id
	                WHERE o.order_id = ? AND o.customer_id = ?`
	
	var response OrderDetailResponse
	err := d.db.QueryRow(order_query, orderId, customerId).Scan(
		&response.OrdersId,
		&response.CustomerId,
		&response.RestaurantId,
		&response.RestaurantName,
		&response.Status,
		&response.TotalAmount,
		&response.DeliveryAddress,
		&response.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	// Get order items
	items_query := `SELECT oi.dish_id, d.name, oi.quantity, oi.unit_price, oi.subtotal
	                FROM foodie_db.order_item oi
	                JOIN foodie_db.dishes d ON oi.dish_id = d.dish_id
	                WHERE oi.order_id = ?`
	
	rows, err := d.db.Query(items_query, orderId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	response.Items = []OrderItemDetail{}
	for rows.Next() {
		var item OrderItemDetail
		if err := rows.Scan(&item.DishId, &item.DishName, &item.Quantity, &item.UnitPrice, &item.Subtotal); err != nil {
			return nil, err
		}
		response.Items = append(response.Items, item)
	}

	if response.Items == nil {
		response.Items = []OrderItemDetail{}
	}

	return &response, nil
}

// Custom error type
type customError struct {
	message string
}

func (e *customError) Error() string {
	return e.message
}
