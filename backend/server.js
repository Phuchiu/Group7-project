const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));