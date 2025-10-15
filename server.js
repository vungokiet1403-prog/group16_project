const express = require('express');
const app = express();

app.use(express.json());

const userRoutes = require('./routes/user'); // đúng đường dẫn
app.use('/api/users', userRoutes); // đúng path

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
