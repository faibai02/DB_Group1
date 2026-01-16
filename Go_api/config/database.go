package config

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func InitDatabase() error {
	// MySQL Database Configuration
	// WARNING: Change these credentials to match your local database setup!
	// Each developer should update these values according to their own MySQL configuration:
	// - User: your MySQL username
	// - Password: your MySQL password (if any)
	// - Host: your MySQL server address
	// - Port: your MySQL server port
	// - Database: your database name
	
	dsn := "root:@tcp(127.0.0.1:3306)/food_delivery_db"

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("MySQL connection error:", err)
		return err
	}

	// Test connection
	err = db.Ping()
	if err != nil {
		log.Fatal("Cannot ping database:", err)
		return err
	}

	DB = db
	log.Println("✅ Successfully connected to MySQL database!")
	return nil
}

func CloseDatabase() {
	if DB != nil {
		DB.Close()
	}
}
