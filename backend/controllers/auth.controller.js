const prisma = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { firstName, lastName: lastName || null, username, email, password: hashedPassword },
    });
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id.toString() }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed. Please try again." });
  }
};

// Turns "jane.doe123@gmail.com" into a unique username like "jane_doe123" / "jane_doe123_1"
async function generateUniqueUsername(email) {
  const base = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "_").toLowerCase().slice(0, 40);
  let username = base;
  let suffix = 0;

  while (await prisma.user.findUnique({ where: { username } })) {
    suffix += 1;
    username = `${base}_${suffix}`;
  }
  return username;
}

// Frontend sends the Google OAuth access_token obtained via Google Identity
// Services' token client (see GoogleAuthButton.jsx). We verify it directly
// with Google's tokeninfo endpoint (confirms it's valid AND issued for our
// client id) before trusting the profile data.
exports.googleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token) {
      return res.status(400).json({ message: "Missing Google access token" });
    }

    const tokenInfoRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${access_token}`
    );
    if (!tokenInfoRes.ok) {
      return res.status(401).json({ message: "Invalid Google token" });
    }
    const tokenInfo = await tokenInfoRes.json();

    if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: "Google token was not issued for this app" });
    }

    const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!profileRes.ok) {
      return res.status(401).json({ message: "Failed to fetch Google profile" });
    }
    const profile = await profileRes.json();
    const { sub: googleId, email, email_verified, name, picture } = profile;

    if (!email) {
      return res.status(400).json({ message: "Google account has no email" });
    }
    if (!email_verified) {
      return res.status(400).json({
        message: "Your Google email isn't verified. Please log in with your password instead.",
      });
    }

    let user = await prisma.user.findUnique({ where: { googleId } });

    if (!user) {
      user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        // Existing email/password account with the same email — link Google to it
        user = await prisma.user.update({
          where: { email },
          data: {
            googleId,
            profileImage: user.profileImage ?? picture ?? null,
          },
        });
      } else {
        const [firstName, ...rest] = (name || "").trim().split(" ");
        const username = await generateUniqueUsername(email);

        user = await prisma.user.create({
          data: {
            firstName: firstName || null,
            lastName: rest.join(" ") || null,
            username,
            email,
            googleId,
            profileImage: picture || null,
            // password stays null — this account can only sign in via Google
          },
        });
      }
    }

    const token = jwt.sign({ id: user.id.toString() }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, email: user.email });
  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(500).json({ message: "Google login failed. Please try again." });
  }
};