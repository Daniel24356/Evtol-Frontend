import express from "express"
import { UserController } from "../controllers/user.controller";
import { authenticateUser } from "../Middleware/auth.middleware";
import { isAdmin } from "../Middleware/isAdmin.middleware";
// import { uploadToCloudinaryProfileImage } from "../configs/cloudinary.config";

const userController = new UserController();
const userRouter = express.Router();

userRouter.post("/", userController.createUser);
userRouter.get("/", authenticateUser, isAdmin, userController.getAllUsers);
userRouter.get("/:id", authenticateUser, userController.getUserById);
userRouter.patch("/:id", authenticateUser, userController.updateUsers);
userRouter.delete("/:id", authenticateUser, userController.deleteUsers)
userRouter.get("/auth/profile", authenticateUser, userController.profile)
// userRouter.put( "/profile-pic",authenticateUser, uploadToCloudinaryProfileImage, userController.updateProfilePic);
userRouter.post("/change-password", authenticateUser, userController.setPassword)

export default userRouter;