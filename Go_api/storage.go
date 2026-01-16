package main

import (
	"database/sql"
	"github.com/go-sql-driver/mysql"
	"time"
	"errors"
	"strings"
	"strconv"
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
	created time.Time
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
	cfg.DBName = "food_delivery_db"  // Changed from "mysql" to the correct database
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
	         is_active 
	         FROM food_delivery_db.restaurants`
	rows,err := d.db.Query(query)
	if err != nil {
		log.Printf("Query error: %v", err)
		return nil,err
	}
	defer rows.Close()
	
	for rows.Next() {
		var rest = restaurant{}
		if err := rows.Scan(&rest.ID,&rest.Name,&rest.Address,&rest.Opening_time,&rest.Phone,&rest.Active); err != nil {
			log.Printf("Scan error: %v", err)
			return nil,err
		}
		// Generate image URL using picsum.photos with restaurant name as seed
		rest.Image = "https://picsum.photos/seed/" + strings.ReplaceAll(rest.Name, " ", "-") + "/400/200"
		rest_group = append(rest_group,&rest)
	}
	
	return rest_group,nil
}
// to check uniqueness before signin
func (d *database) CheckAndStoreUser(cus customers) error {
	check_unique := `SELECT EXISTS(SELECT 1 FROM food_delivery_db.customers WHERE email = ?)`
	insert := `INSERT INTO food_delivery_db.customers(customer_id,name,email,password,phone) VALUES(?,?,?,?,?)`
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
func (d *database) LoginChecker(body loginBody) error {
	var sql_password string
	find_pass := `SELECT password FROM food_delivery_db.customers WHERE email = ?`
	row := d.db.QueryRow(find_pass,body.Email)

	if err := row.Scan(&sql_password); err != nil {
		return err
	}
	
	// Compare hashed password with bcrypt
	err := bcrypt.CompareHashAndPassword([]byte(sql_password), []byte(body.Pass))
	if err != nil {
		return errors.New("Invalid email or password")
	}

	return nil
}
func (d *database) GetCustomer(email string) (*customers,error) {
	get_user := `SELECT * FROM food_delivery_db.customers WHERE email = ?`
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
	               COALESCE(d.category, '') as category,
	               COALESCE(r.name, '') as restaurant_name
	               FROM food_delivery_db.dishes d
	               LEFT JOIN food_delivery_db.restaurants r ON d.restaurant_id = r.restaurant_id`

	rows,err := d.db.Query(get_dishes)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var temp_dish dishes
		err := rows.Scan(&temp_dish.ID,&temp_dish.Rest_id,&temp_dish.Name,&temp_dish.Description,&temp_dish.Price,&temp_dish.Available,&temp_dish.Category,&temp_dish.RestaurantName)
		if err != nil {
			return nil,err
		}
		// Generate unique image URL using picsum.photos with dish ID as seed
		temp_dish.Image = "https://picsum.photos/seed/dish-" + strconv.Itoa(int(temp_dish.ID)) + "/400/300"
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
	               FROM food_delivery_db.orders
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
			&temp_order.Deliver_address, &temp_order.created)
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
	delete_order := `DELETE FROM food_delivery_db.orders 
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
	update_order := `UPDATE food_delivery_db.orders 
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

// Custom error type
type customError struct {
	message string
}

func (e *customError) Error() string {
	return e.message
}
