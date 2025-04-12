// src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // Change if backend uses a different port
  withCredentials: true, // Include credentials for CORS
  
});

export default instance;
