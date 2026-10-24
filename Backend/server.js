const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const helmet = require("helmet");

dotenv.config();

const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((name) => !process.env[name] || process.env[name].includes('REPLACE_ME'));
if (missingEnv.length) {
  throw new Error(`Missing required backend environment variables: ${missingEnv.join(', ')}. Set them in Backend/.env (see Backend/.env.example).`);
}

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",  //Mandatory*** Add the post deployment website links here
];
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header (Postman, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(helmet());
//Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/connections', require('./routes/connections'));
app.use('/api/posts', require('./routes/posts'));

app.get('/', (req, res) => {
  res.send('CampusConnect API Running');
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)));
} else {
  connectDB();
}

module.exports = app;
