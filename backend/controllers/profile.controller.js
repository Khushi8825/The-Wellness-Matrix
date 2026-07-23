const prisma = require("../config/db");

const profileSelect = {
  username: true,
  email: true,
  profileImage: true,
  phone: true,
  dateOfBirth: true,
  pastHealthIssues: true,
};

const getProfile = async (req, res) => {
  try {
    const profile = await prisma.user.findUnique({
      where: { id: Number(req.user.id) },
      select: profileSelect,
    });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    return res.json(profile);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, profileImage, phone, dateOfBirth, pastHealthIssues } = req.body;
    const data = {};
    if (username !== undefined) {
      const trimmedUsername = username.trim();
      if (!trimmedUsername) return res.status(400).json({ message: "Username is required" });
      data.username = trimmedUsername;
    }
    if (profileImage !== undefined) data.profileImage = profileImage || null;
    if (phone !== undefined) data.phone = phone?.trim() || null;
    if (pastHealthIssues !== undefined) data.pastHealthIssues = pastHealthIssues?.trim() || null;
    if (dateOfBirth !== undefined) {
      const parsedDate = dateOfBirth ? new Date(`${dateOfBirth}T00:00:00.000Z`) : null;
      if (parsedDate && Number.isNaN(parsedDate.getTime())) return res.status(400).json({ message: "Date of birth is invalid" });
      if (parsedDate && parsedDate > new Date()) return res.status(400).json({ message: "Date of birth cannot be in the future" });
      data.dateOfBirth = parsedDate;
    }

    const profile = await prisma.user.update({
      where: { id: Number(req.user.id) }, data, select: profileSelect,
    });
    return res.json({ message: "Profile updated successfully", profile });
  } catch (error) {
    if (error.code === "P2002") return res.status(400).json({ message: "That username is already in use" });
    console.error("Profile update error:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = { getProfile, updateProfile };
