const axios = require("axios");
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBob3NwaXRhbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3ODE2NzcxNDAsImV4cCI6MTc4MTc2MzU0MH0._RAUGxtQ4otMNxlL9SHj5CUwA7Bnq3nZemoVJbAFrCc';
axios.post('https://hospital-managementbackend.onrender.com/api/users', {username:'admin', email:'admin@hospital.com', password:'password123', role:'admin'}, { headers: { Authorization: `Bearer ${token}` } })
  .then(res => console.log(res.status, JSON.stringify(res.data)))
  .catch(err => console.error(err.response?.status, JSON.stringify(err.response?.data) || err.message));
