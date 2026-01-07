const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const cors = require("cors");

const corsHandler = cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    preflightContinue: true,
});

app.use(corsHandler);

mongoose
    .connect("mongodb://127.0.0.1:27017/jwt_with_products")
    .then(() => {
        app.listen(3000, () => {
            console.log("Express Server Started");
        });
    })
    .catch((err) => {
        console.log(err);
    });

app.use("/user", userRoutes);


function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(" ")[1];

    jwt.verify(token, "6638591936de503893853bba1919b433b3afb1495ba75f60d0011ed3041ad28e7af01e3d009a5bc092f502ca861049d08ed1f1a5936bb892eb58b81ab18d0b8a", (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.get("/dashboard", verifyToken, (req, res) => {
    res.send("You have reached a protected content!");
});
app.use("/product", productRoutes)