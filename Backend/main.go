package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-redis/redis/v8"
	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/cors"
)

var ctx = context.Background()
var db *sql.DB

func main() {
	// Initialize Redis client using environment variables
	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", os.Getenv("REDIS_HOST"), os.Getenv("REDIS_PORT")),
		Password: os.Getenv("REDIS_PASSWORD"), // Use environment variables for Redis
		DB:       0,                           // use default DB
	})

	// Initialize SQLite database connection
	var err error
	db, err = sql.Open("sqlite3", "./userpoints.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Verify database connection and table existence
	log.Println("Verifying database connection...")
	err = db.Ping()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS userpoints (userId TEXT PRIMARY KEY, score INTEGER)")
	if err != nil {
		log.Fatalf("Failed to ensure userpoints table exists: %v", err)
	}

	// Create a new CORS handler
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"https://exploding-kitten-1607.netlify.app"}, // Allow your Netlify frontend
		AllowedMethods:   []string{"GET", "POST"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	http.HandleFunc("/update-score", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
			return
		}

		var requestData struct {
			UserID      string `json:"userId"`
			IncrementBy int    `json:"incrementBy"`
		}

		if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		// Update the user's score in Redis
		newScore, err := rdb.IncrBy(ctx, fmt.Sprintf("user:%s:points", requestData.UserID), int64(requestData.IncrementBy)).Result()
		if err != nil {
			http.Error(w, "Failed to update score", http.StatusInternalServerError)
			return
		}

		// Add detailed logging for database update
		log.Printf("Updating score in database for userId: %s with newScore: %d", requestData.UserID, newScore)

		// Update the user's score in the database
		_, err = db.Exec("UPDATE userpoints SET score = ? WHERE userId = ?", newScore, requestData.UserID)
		if err != nil {
			log.Printf("Error updating score in database for userId: %s, error: %v", requestData.UserID, err)
			http.Error(w, "Failed to update score in database", http.StatusInternalServerError)
			return
		}

		log.Printf("Successfully updated score in database for userId: %s", requestData.UserID)

		response := map[string]interface{}{
			"message": "Score updated successfully",
			"userId":  requestData.UserID,
			"score":   newScore,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	})

	// Wrap your handlers with the CORS handler
	handler := c.Handler(http.DefaultServeMux)

	// Use the PORT environment variable
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT environment variable is not set")
	}

	log.Printf("Go server running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
