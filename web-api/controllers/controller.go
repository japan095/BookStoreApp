package controllers

import (
	"example/web-service/database"

	"github.com/gin-gonic/gin"
)

type Book struct {
	Id     int    `json:"id"`
	Title  string `json :"title"`
	Author string `json:"author"`
	Genre  string `json:"genre"`
	Year   string `json:"year"`
}

func GetAll(c *gin.Context) {
	db := database.DBConn()

	rows, err := db.Query("Select *from bookstore.book")
	
	if err != nil {
		c.JSON(500, gin.H{
			"messages": "Not found",
		})
	}

	type Queue []Book

	book := Book{}
	var list_book Queue

	for rows.Next() {
		var id int
		var title, author, genre, year string

		err = rows.Scan(&id, &title, &author, &genre, &year)
		if err != nil {
			panic(err.Error())
		}

		book.Id = id
		book.Title = title
		book.Author = author
		book.Genre = genre
		book.Year = year

		list_book = append(list_book, book)
	}

	c.JSON(200, list_book)
}

func Read(c *gin.Context) {

	db := database.DBConn()
	rows, err := db.Query("SELECT * FROM bookstore.book WHERE id = " + c.Param("id"))

	if err != nil {
		c.JSON(500, gin.H{
			"messages": "Not found",
		})
	}

	book := Book{}

	for rows.Next() {
		var id int
		var title, author, genre, year string

		err = rows.Scan(&id, &title, &author, &genre, &year)
		if err != nil {
			panic(err.Error())
		}

		book.Id = id
		book.Title = title
		book.Author = author
		book.Genre = genre
		book.Year = year
	}

	c.JSON(200, book)
	defer db.Close()
}

func Create(c *gin.Context) {
	db := database.DBConn()

	type CreateBook struct {
		Title  string `form:"title" json:"title" binding:"required"`
		Author string `form:"author" json:"author" binding:"required"`
		Genre  string `form:"genre" json:"genre" binding:"required"`
		Year   string `form:"year" json:"year" binding:"required"`
	}

	var json CreateBook

	if err := c.ShouldBindJSON(&json); err == nil {
		insPost, err := db.Prepare("INSERT INTO bookstore.book(title, author,genre,year) VALUES(?,?,?,?)")
		if err != nil {
			c.JSON(500, gin.H{
				"messages": err,
			})
		}

		insPost.Exec(json.Title, json.Author, json.Genre, json.Year)
		c.JSON(200, gin.H{
			"messages": "inserted",
		})
	} else {
		c.JSON(500, gin.H{"error": err.Error()})
	}

	defer db.Close()
}

func Update(c *gin.Context) {
	db := database.DBConn()

	type UpdateBook struct {
		Title  string `form:"title" json:"title" binding:"required"`
		Author string `form:"author" json:"author" binding:"required"`
		Genre  string `form:"genre" json:"genre" binding:"required"`
		Year   string `form:"year" json:"year" binding:"required"`
	}

	var json UpdateBook

	if err := c.ShouldBindJSON(&json); err == nil {
		edit, err := db.Prepare("UPDATE bookstore.book SET title=?, author=? , genre=?,year=? WHERE id= " + c.Param("id"))
		if err != nil {
			panic(err.Error())
		}
		edit.Exec(json.Title, json.Author, json.Genre, json.Year)

		c.JSON(200, gin.H{
			"messages": "edited",
		})
	} else {
		c.JSON(500, gin.H{"error": err.Error()})
	}
	defer db.Close()
}

func Delete(c *gin.Context) {
	db := database.DBConn()

	delete, err := db.Prepare("delete from bookstore.book where id=?")
	if err != nil {
		panic(err.Error())
	}
	delete.Exec(c.Param("id"))
	c.JSON(200, gin.H{
		"messsage": "deleted",
	})

	defer db.Close()
}
