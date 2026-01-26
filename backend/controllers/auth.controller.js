const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
 
  try {
      console.log("➡️ Register API HIT");
    const { firstName, lastName, username, email, password } = req.body;

    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1 OR username=$2",
      [email, username],
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
console.log("🔎 Existing rows:", existing.rows.length);
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
   (first_name, last_name, username, email, password)
   VALUES ($1,$2,$3,$4,$5)
   RETURNING *`,
      [firstName, lastName, username, email, hashedPassword],
    );

    console.log("✅ Inserted user:", result.rows[0]);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
