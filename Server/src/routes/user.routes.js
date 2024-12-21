import { Router } from "express";
import { Register ,Login,Logout, refreshAccessToken} from "../Controllers/user.controller.js";
import { verifyJWT } from './../middleware/auth.middleware.js';

const router = Router();



router.route('/register').post(Register);
router.route('/login').post(Login);
router.route('/logout').post(verifyJWT,Logout);
router.route('/refreshToken').post(refreshAccessToken);



export default router;