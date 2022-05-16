package main

import (
	"example/web-service/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func setupRouter() *gin.Engine {
	r := gin.Default()
	r.Static("/public", "./public")

	client := r.Group("/api")
	{
		client.GET("/book/:id", controllers.Read)
		client.GET("/book/getall", controllers.GetAll)
		client.POST("/book/create", controllers.Create)
		client.PUT("/book/update/:id", controllers.Update)
		client.DELETE("/book/delete/:id", controllers.Delete)
	}

	return r
}

func main() {
	r := setupRouter()
	r.Use(cors.New(cors.Config{
		AllowOriginFunc:  func(origin string) bool { return true },
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type"},
		AllowCredentials: true,
	}))
	r.Run(":8080") // Ứng dụng chạy tại cổng 8080
}
