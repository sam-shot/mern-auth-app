import { Router } from "express";
import * as controller from '../controllers/appController.js';
const  router = Router();



router.route('/auth/register').post(controller.register);
router.route('/auth/login').post(controller.login);



router.route('/user/:email').get(controller.getUser);


export default router;