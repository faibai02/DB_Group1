package main

import (
"database_project/config"
"log"
)

func main() {
	// Initialize database connection
	if err := config.InitDatabase(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer config.CloseDatabase()

	server, err := Init()
	if err != nil {
		log.Fatalf("Failed to init server: %v", err)
	}

	server.Run(":6969")
}
