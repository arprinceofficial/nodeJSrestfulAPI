require("dotenv").config();
const express = require('express');
var cors = require('cors');
const app = express();
var allowedOrigins = ['http://localhost:8080'];
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
const userRouter = require('./api/users/user.router');

app.use(express.json());
app.use("/api/users", userRouter);


app.listen(process.env.APP_PORT, () => {
    console.log('Server running on port', process.env.APP_PORT);
});