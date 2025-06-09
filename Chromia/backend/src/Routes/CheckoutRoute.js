import { Router } from "express";
import { authMiddleware } from "../Middlewares/Auth.Middleware.js";
import { buyNow } from "../Controllers/Checkout.Controllers.js"; // <-- Capital "C"

const router = Router();
router.post("/buy-now", authMiddleware, buyNow);
export default router;
