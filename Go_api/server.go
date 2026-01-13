package main

import (
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
	config.AllowOrigins = []string{"http://localhost:3000"}
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
	s.router.GET("/home",s.getHome)

	s.router.POST("/login",s.logIn)
	// authorise function
	authorise := s.router.Group("/user")
	authorise.Use(s.AuthMid)
	{
		authorise.GET("/profile",s.getProfile)
	}
	
		

	if err:= s.router.Run(port); err != nil {
		log.Fatalf("failed to run server %v",err)
	}
	
}
func(s *server) AuthMid(c *gin.Context) {
	tokenSigned,err := c.Cookie("Authorisation")
	if err != nil{
		c.AbortWithStatus(http.StatusUnauthorized)
	
	}

	token, err := jwt.Parse(tokenSigned, func(token *jwt.Token) (any, error) {
		return []byte(secret), nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))

	if claims,ok := token.Claims.(jwt.MapClaims); ok && token.Valid{
		if float64(time.Now().Unix())> claims["exp"].(float64){
			c.AbortWithStatus(http.StatusUnauthorized)
		}
		
		// set for next	
		c.Set("customer_email",claims["sub"])
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
func (s *server) getHome(c *gin.Context){
	dishes,err := s.database.GetAllDishes()
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
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
		"exp": time.Now().Add(time.Minute*2).Unix(),
	})
	tokenSigned,err := token.SignedString([]byte(secret))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest,gin.H{
			"message": "Something went wrong",
		})
	}
	
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorisation",tokenSigned,3600,"","",false,true)

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
