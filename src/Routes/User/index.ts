import UserController from "@/Controller/User";
import { Routes } from "@/Interfaces/router";
import UserAuthMiddlewares from "@/Middlewares/user";
import UserValidator from "@/Validators/user";
import { Router } from "express";
import { Inject, Service } from "typedi";

@Service()
class UserRouter implements Routes {
  constructor (
    @Inject() private readonly userController: UserController,
    private readonly authMiddleware: UserAuthMiddlewares,
    private readonly userValidator: UserValidator
  ) {
    this.path = "/users";
    this.router = Router();

    this.initializeRoutes()
  }

  public path: string;
  public router: Router;

  private initializeRoutes () {
    this.router.post('/', this.userValidator.validateCreateUser, this.userController.createUserCTRL);
    this.router.post('/login', this.userValidator.validateLogin, this.userController.loginUserCTRL);
    this.router.post('/password', this.userController.forgetPasswordCTRL);
    this.router.put('/password', this.userController.resetPasswordCTRL)
    this.router.patch('/password', this.authMiddleware.isAuth, this.userController.resetPasswordCTRL)
    this.router.get('/me', this.authMiddleware.isAuth, this.userController.getUserCTRL);
  }
}

export default UserRouter;
