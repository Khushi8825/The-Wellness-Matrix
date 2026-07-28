const fs = require("fs");
const path = require("path");
const prisma = require("../config/db");

const toPublicUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  username: user.username,
  email: user.email,
  profileImage: user.profileImage || null,
});

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(req.user.id) } });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(toPublicUser(user));
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Failed to load profile" });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image file was provided" });

    const userId = Number(req.user.id);
    const relativePath = `/uploads/profile-pictures/${req.file.filename}`;

    const previousUser = await prisma.user.findUnique({ where: { id: userId } });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profileImage: relativePath },
    });

    // Best-effort cleanup of the old picture so uploads don't pile up.
    if (previousUser?.profileImage && previousUser.profileImage !== relativePath) {
      const oldFilePath = path.join(__dirname, "..", previousUser.profileImage);
      fs.unlink(oldFilePath, () => {});
    }

    return res.status(200).json({
      message: "Profile picture updated successfully",
      profileImage: updatedUser.profileImage,
    });
  } catch (error) {
    console.error("Profile picture upload error:", error);
    return res.status(500).json({ message: "Failed to upload profile picture" });
  }
};

module.exports = { getMe, uploadProfilePicture };
