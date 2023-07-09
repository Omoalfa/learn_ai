import UserServices from "@/Services/User";
import { RequestWithAuth } from "@/Types";
import knex from "@Database/index";
import { created, serverError, success, successAction } from "@Utils/api_response";
import { Request, Response } from "express";
import { Service } from "typedi";

@Service()
class UserController {
  constructor (
    private readonly userServices: UserServices
  ) {}

  public async createUserCTRL(req: Request, res: Response) {
    const { first_name, last_name, email, phone, password } = req.body;

    try {
      const user = await this.userServices.createUserService({ first_name, last_name, password, email, phone })

      return created(res, user, "User account created successfully")
    } catch (error) {
      return serverError(res);
    }
  }

  public async loginUserCTRL(req: Request, res: Response) {
    const { email } = req.body;

    try {
      const token = await this.userServices.loginUserService(email);

      return success(res, { token });
    } catch (error) {
      return serverError(res);
    }
  }

  public async forgetPasswordCTRL(req: Request, res: Response) {
    const { email } = req.query;

    try {
      await this.userServices.initializeForgetPassowrdService(email as string);

      return successAction(res);
    } catch (error) {
      return serverError(res);
    }
  }

  public async resetPasswordCTRL(req: Request, res: Response) {
    const { password, id } = req.body;

    try {
      await this.userServices.updateUserPassword(password, id)

      return successAction(res, "Password reset successful");
    } catch (error) {
      return serverError(res);
    }
  }

  public async getUserCTRL(req: RequestWithAuth, res: Response) {
    const { id } = req.user;

    try {
      const user = await this.userServices.getUserByIdService(id);

      return success(res, user, "User details fetched");
    } catch (error) {
      return serverError(res);
    }
  }
}

export default UserController;
