package main

import (
	"fmt"
	"log"
	"net/http"
  	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"time"
	"github.com/gin-contrib/cors"
  )

// type use for server and login
type server struct {
	router *gin.Engine
	database *database
}
type loginBody struct {
	Email string `json:"email"`
	Pass string `json:"password"`
}
const secret string = "cat"


func Init()(*server,error) {
	// init router and config
	r := gin.Default()
	config:= cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3001", "http://localhost:5173"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	db,err := NewDB()
	if err != nil {
		return nil,err
	}

	return &server{
		router: r,
		database:db,
	},err

}

func (s *server) Run(port string) {
	

	s.router.POST("/signin",s.signIn)
	s.router.GET("/restaurant",s.getRestaurant)
	s.router.GET("/categories",s.getCategories)
	s.router.GET("/home",s.getHome)

	s.router.POST("/login",s.logIn)
	s.router.POST("/logout",s.logOut)
	s.router.GET("/auth/check",s.checkAuth)
	// authorise function
	authorise := s.router.Group("/user")
	authorise.Use(s.AuthMid)
	{
		authorise.GET("/profile",s.getProfile)
		authorise.PUT("/profile",s.updateProfile)
		authorise.POST("/orders",s.createOrder)
		authorise.GET("/orders",s.getOrders)
		authorise.GET("/orders/:id",s.getOrderDetail)
		authorise.DELETE("/orders/:id",s.deleteOrder)
		authorise.PUT("/orders/:id",s.updateOrder)
		authorise.DELETE("/orders/:id/items/:dishId",s.deleteOrderItem)
		authorise.PUT("/orders/:id/items/:dishId",s.updateOrderItemQuantity)
	}
	
		

	if err:= s.router.Run(port); err != nil {
		log.Fatalf("failed to run server %v",err)
	}
	
}
func(s *server) AuthMid(c *gin.Context) {
	tokenSigned,err := c.Cookie("Authorisation")
	if err != nil{
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	token, err := jwt.Parse(tokenSigned, func(token *jwt.Token) (any, error) {
		return []byte(secret), nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))

	if claims,ok := token.Claims.(jwt.MapClaims); ok && token.Valid{
		if float64(time.Now().Unix())> claims["exp"].(float64){
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		
		// Get customer from database to retrieve customer_id
		email := claims["sub"].(string)
		cus, err := s.database.GetCustomer(email)
		if err != nil {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		
		// set both email and id for next handlers
		c.Set("customer_email", email)
		c.Set("customer_id", cus.ID)
		c.Next()
	}else {
		c.AbortWithStatus(http.StatusUnauthorized)
	}
}
//add get restaurant db
func (s *server) getRestaurant(c *gin.Context){
	rest_group,err := s.database.GetRest()
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}
	c.IndentedJSON(http.StatusOK,rest_group)
}

// get categories handler
func (s *server) getCategories(c *gin.Context){
	categories, err := s.database.GetCategories()
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}
	c.IndentedJSON(http.StatusOK, categories)
}

func (s *server) getHome(c *gin.Context){
	dishes,err := s.database.GetAllDishes()
	if err != nil {
		// Log the error for debugging
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	// return json array if everything ok
	c.IndentedJSON(http.StatusOK,dishes)
}

// sign in handler
func (s *server) signIn(c *gin.Context){
	var temp_cus  customers
	if c.BindJSON(&temp_cus) != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,gin.H{
			"error": "unable to bind the request",
		})
		return
	}
	// check exist and put data in db
	err := s.database.CheckAndStoreUser(temp_cus)
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	
	//success result
	c.JSON(http.StatusOK,gin.H{})
	
}
//login handler
func (s *server) logIn(c *gin.Context) {
	var temp_body loginBody
	if c.BindJSON(&temp_body) != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,gin.H{
			"error": "unable to bind the request",
		})
		return	
	}
	//compare the id (currently not hash the password)
	err := s.database.LoginChecker(temp_body)
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}	
	// generate jwt and return as cookie
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":temp_body.Email,
		"exp": time.Now().Add(time.Hour*24).Unix(),
	})
	tokenSigned,err := token.SignedString([]byte(secret))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,gin.H{
			"message": "Something went wrong",
		})
	}
	
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorisation",tokenSigned,86400,"","",false,true)

	c.JSON(http.StatusOK,gin.H{})
	
}
// func to get user profile
func (s *server) getProfile(c *gin.Context) {
	email,ok := c.Get("customer_email")
	if !ok || len(email.(string)) == 0 {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	
	}
	cus,err := s.database.GetCustomer(email.(string))
	if err!= nil{
		c.AbortWithStatusJSON(http.StatusBadRequest,gin.H{
			"message": "something wrong",
		})
		return	
	}
	c.JSON(http.StatusOK,cus)

}

// func to update user profile
func (s *server) updateProfile(c *gin.Context) {
	customerId, ok := c.Get("customer_id")
	if !ok {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}
	
	var req struct {
		Name  string `json:"name" binding:"required"`
		Email string `json:"email" binding:"required,email"`
	}
	
	if err := c.BindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request",
		})
		return
	}
	
	err := s.database.UpdateCustomerProfile(customerId.(int), req.Name, req.Email)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"message": "Profile updated successfully",
	})
}

// check authentication status
func (s *server) checkAuth(c *gin.Context) {
	tokenSigned,err := c.Cookie("Authorisation")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"authenticated": false,
		})
		return
	}

	token, err := jwt.Parse(tokenSigned, func(token *jwt.Token) (any, error) {
		return []byte(secret), nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))

	if claims,ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"authenticated": false,
			})
			return
		}
		
		email := claims["sub"].(string)
		cus, err := s.database.GetCustomer(email)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"authenticated": false,
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"authenticated": true,
			"name": cus.Name,
			"email": cus.Email,
			"customerId": cus.ID,
		})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{
			"authenticated": false,
		})
	}
}

// logout handler
func (s *server) logOut(c *gin.Context) {
	c.SetCookie("Authorisation", "", -1, "", "", false, true)
	c.JSON(http.StatusOK, gin.H{
		"message": "logged out successfully",
	})
}

// create order for authenticated user
func (s *server) createOrder(c *gin.Context) {
	customerId, ok := c.Get("customer_id")
	if !ok {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	var req struct {
		RestaurantId    int           `json:"restaurant_id" binding:"required"`
		TotalAmount     float64       `json:"total_amount" binding:"required"`
		DeliveryAddress string        `json:"delivery_address" binding:"required"`
		Items           []map[string]interface{} `json:"items" binding:"required"`
	}

	if err := c.BindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request",
		})
		return
	}

	orderId, err := s.database.CreateOrder(customerId.(int), req.RestaurantId, req.TotalAmount, req.DeliveryAddress, req.Items)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"order_id": orderId,
		"message": "Order created successfully",
	})
}

// get orders for authenticated user
func (s *server) getOrders(c *gin.Context) {
	email, ok := c.Get("customer_email")
	if !ok || len(email.(string)) == 0 {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	cus, err := s.database.GetCustomer(email.(string))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "customer not found",
		})
		return
	}

	orders, err := s.database.GetCustomerOrders(cus.ID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "failed to fetch orders",
		})
		return
	}

	// Return empty array instead of null if no orders
	if orders == nil {
		c.JSON(http.StatusOK, []interface{}{})
		return
	}

	c.JSON(http.StatusOK, orders)
}

// delete order (only if status is Pending)
func (s *server) deleteOrder(c *gin.Context) {
	email, ok := c.Get("customer_email")
	if !ok || len(email.(string)) == 0 {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	cus, err := s.database.GetCustomer(email.(string))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "customer not found",
		})
		return
	}

	orderId := c.Param("id")
	if orderId == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "order ID required",
		})
		return
	}

	var orderIdInt int
	if _, err := fmt.Sscanf(orderId, "%d", &orderIdInt); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "invalid order ID",
		})
		return
	}

	err = s.database.DeleteOrder(orderIdInt, cus.ID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "order deleted successfully",
	})
}

// get order detail with items
func (s *server) getOrderDetail(c *gin.Context) {
	email, ok := c.Get("customer_email")
	if !ok || len(email.(string)) == 0 {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	cus, err := s.database.GetCustomer(email.(string))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "customer not found",
		})
		return
	}

	orderId := c.Param("id")
	if orderId == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "order ID required",
		})
		return
	}

	var orderIdInt int
	if _, err := fmt.Sscanf(orderId, "%d", &orderIdInt); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "invalid order ID",
		})
		return
	}

	orderDetail, err := s.database.GetOrderDetail(orderIdInt, cus.ID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "order not found",
		})
		return
	}

	c.JSON(http.StatusOK, orderDetail)
}

// update order delivery address (only if status is Pending)
func (s *server) updateOrder(c *gin.Context) {
	email, ok := c.Get("customer_email")
	if !ok || len(email.(string)) == 0 {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	cus, err := s.database.GetCustomer(email.(string))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "customer not found",
		})
		return
	}

	orderId := c.Param("id")
	if orderId == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "order ID required",
		})
		return
	}

	var orderIdInt int
	if _, err := fmt.Sscanf(orderId, "%d", &orderIdInt); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "invalid order ID",
		})
		return
	}

	var body struct {
		DeliveryAddress string `json:"delivery_address"`
	}
	
	if err := c.ShouldBindJSON(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "invalid request body",
		})
		return
	}

	if body.DeliveryAddress == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "delivery address required",
		})
		return
	}

	err = s.database.UpdateOrderAddress(orderIdInt, cus.ID, body.DeliveryAddress)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "order updated successfully",
	})
}
// delete order item
func (s *server) deleteOrderItem(c *gin.Context) {
	email, ok := c.Get("customer_email")
	if !ok || len(email.(string)) == 0 {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	cus, err := s.database.GetCustomer(email.(string))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "customer not found",
		})
		return
	}

	orderId := c.Param("id")
	if orderId == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "order ID required",
		})
		return
	}

	dishId := c.Param("dishId")
	if dishId == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "dish ID required",
		})
		return
	}

	var orderIdInt, dishIdInt int
	if _, err := fmt.Sscanf(orderId, "%d", &orderIdInt); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "invalid order ID",
		})
		return
	}

	if _, err := fmt.Sscanf(dishId, "%d", &dishIdInt); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "invalid dish ID",
		})
		return
	}

	err = s.database.DeleteOrderItem(orderIdInt, cus.ID, dishIdInt)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "item removed successfully",
	})
}

// update order item quantity
func (s *server) updateOrderItemQuantity(c *gin.Context) {
	email, ok := c.Get("customer_email")
	if !ok || len(email.(string)) == 0 {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	cus, err := s.database.GetCustomer(email.(string))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "customer not found",
		})
		return
	}

	orderId := c.Param("id")
	if orderId == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "order ID required",
		})
		return
	}

	dishId := c.Param("dishId")
	if dishId == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "dish ID required",
		})
		return
	}

	var orderIdInt, dishIdInt int
	if _, err := fmt.Sscanf(orderId, "%d", &orderIdInt); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "invalid order ID",
		})
		return
	}

	if _, err := fmt.Sscanf(dishId, "%d", &dishIdInt); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "invalid dish ID",
		})
		return
	}

	var body struct {
		Quantity int `json:"quantity"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "invalid request",
		})
		return
	}

	err = s.database.UpdateOrderItemQuantity(orderIdInt, cus.ID, dishIdInt, body.Quantity)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "item updated successfully",
	})
}