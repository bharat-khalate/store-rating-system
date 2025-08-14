import axios from "axios";




const api = axios.create({
    baseURL: "http://localhost:5000/api/v1", // 🔁 Replace with your actual API base URL
    headers: {
      "Content-Type": "application/json",
    },
  });

  export default api;