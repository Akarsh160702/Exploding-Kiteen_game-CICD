import axios from "axios";

// Define URLs for both backends
const NODE_API_URL = "https://exploding-kitten-game-backend-node.onrender.com";
const GO_API_URL = "https://exploding-kitten-game-backend-go.onrender.com";

// Function using Node backend to get user points
export const getUserPoints = async (userId: string) => {
  try {
    const response = await axios.get(`${NODE_API_URL}/points/${userId}`, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
    console.log("Fetched points from Node backend:", response.data.points);
    return response.data.points;
  } catch (error) {
    console.error("Error fetching user points:", error);
    return 0;
  }
};

// Function using Go backend to update user points
export const updateUserPoints = async (userId: string, incrementBy: number) => {
  try {
    const response = await axios.post(
      `${GO_API_URL}/update-score`,
      { userId, incrementBy }, // Ensure userId is included in the request body
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
    console.log("Response from Go backend after updating points:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating user points:", error);
    throw error;
  }
};

// Function using Node backend to get leaderboard
export const getLeaderboard = async () => {
  try {
    const response = await axios.get(`${NODE_API_URL}/leaderboard`, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
    console.log("Fetched leaderboard from Node backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};