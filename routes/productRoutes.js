const express = require("express");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");

const router = express.Router();

// --- Inline token verification middleware ---
async function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Expected format: "Bearer <token>"
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Malformed token" });
        }

        const decoded = jwt.verify(token, "6638591936de503893853bba1919b433b3afb1495ba75f60d0011ed3041ad28e7af01e3d009a5bc092f502ca861049d08ed1f1a5936bb892eb58b81ab18d0b8a");
        req.user = decoded; // attach user info to request
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

// --- Protected route: GET all products ---
router.get("/", verifyToken, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// --- Protected route: GET single product by ID ---
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
