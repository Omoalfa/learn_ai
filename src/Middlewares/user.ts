import { AuthAdapter } from "@/Database/adapters/user";
import { RequestWithAuth } from "@/Types";
import { serverError, unAthorized } from "@/Utils/api_response";
import { verifyToken } from "@/Utils/helper";
import { NextFunction, Response } from "express";
import { Service } from "typedi";


@Service()
class UserAuthMiddlewares {
  constructor (
    private readonly userAdapter: AuthAdapter
  ) {}

  public async isAuth (req: RequestWithAuth, res: Response, next: NextFunction) {
    try {
      const authorization = req.headers["authorization"];

      if (!authorization.startsWith("Bearer")) return unAthorized(res, "Invalid token");

      const token = authorization.split(" ")[1];

      const { id } = verifyToken(token);

      const user = await this.userAdapter.DBGetUserByIdOrEmailOrPhone(id, "id");

      if (!user) return unAthorized(res, "Invalid token");

      req.user = user;

      return next();
    } catch (error) {
      return serverError(res);
    }
  }
}

export default UserAuthMiddlewares;
