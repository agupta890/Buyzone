// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const router = require("./router/auth-router")

app.use("/api/auth",router);


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
