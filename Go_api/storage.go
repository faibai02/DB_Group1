package main

import (
	"database/sql"
	"github.com/go-sql-driver/mysql"
	"time"
	"errors"
	
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
	ID int `json:"dish_id"`
	Rest_id int `json:"restaurant_id"`
	Name string `json:"name"`
	Description string `json:"description"`
	Price float32 `json:"price"`
	Available bool `json:"is_available"`
	Category string `json:"category"`
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
	created time.Time
	Active bool`json:"is_active"`
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
	cfg.DBName = "mysql"
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
	query:= `SELECT * FROM food_delivery_db.restaurants`
	rows,err := d.db.Query(query)
	if err != nil {
		return nil,err
	}
	for rows.Next() {
		var rest = restaurant{}
		if err := rows.Scan(&rest.ID,&rest.Name,&rest.Address,&rest.Opening_time,&rest.Phone,&rest.created,&rest.Active); err != nil {
			return nil,err
		}
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

	_,err := d.db.Exec(insert,cus.ID,cus.Name,cus.Email,cus.Pass,cus.Phone)
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
	if body.Pass != sql_password {
		return errors.New("Unauthorise")
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
	get_dishes := `SELECT * FROM food_delivery_db.dishes`

	rows,err := d.db.Query(get_dishes)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var temp_dish dishes
		err := rows.Scan(&temp_dish.ID,&temp_dish.Rest_id,&temp_dish.Name,&temp_dish.Description,&temp_dish.Price,&temp_dish.Available,&temp_dish.Category)
		if err != nil {
			return nil,err
		}
		dishes_array = append(dishes_array,&temp_dish)
	}

	return dishes_array,nil
}
