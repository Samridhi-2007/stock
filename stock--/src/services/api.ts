// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // This will use your .env variable
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Rest of your interceptor code...