package main


import (
	_"fmt"
	"log"
)


func main() {
	server,err := Init()
	if err != nil {
		log.Fatalf("failed to init server %v",err)
	}

	server.Run(":6969")

	
	

						





}
