import { Router } from "express";
import * as controller from '../controllers/appController.js';
import Auth, { localVar} from "../middleware/auth.js";
const  router = Router();



router.route('/auth/register').post(controller.register);
router.route('/auth/loginEmail').post(controller.loginEmail);
router.route('/auth/loginUsername').post(controller.loginUsername);






router.route('/user/update').put(Auth, controller.updateUser);



router.route('/user/:username').get(controller.getUser);
router.route('/auth/generateotp').get(controller.verifyUser, localVar, controller.generateOTP);
router.route('/auth/verifyotp').get(controller.verifyUser,controller.verifyOtp);


export default router;