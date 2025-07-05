import express from "express"
import { addContacts, checkAuth, getContactList, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile",protectRoute,updateProfile);
router.get("/check",protectRoute,checkAuth)
router.get("/contacts",protectRoute,getContactList);
router.post("/addcontact",protectRoute,addContacts);

export default router;