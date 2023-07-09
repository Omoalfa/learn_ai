import knex from "@Database/index";
import { ETables, IUser } from "@Types/index";
import bcrypt from "bcrypt";
import { Service } from "typedi";

@Service()
class UserAdapter {

  public DBCreateUser = async (data: IUser) => {
    try {
      const user = await knex.table(ETables.USERS).insert(data).returning("*")

      return user;
    } catch (error) {
      throw new Error(error)
    }
  }

  public DBGetUserByIdOrEmailOrPhone = async (value: string | number, type: "id" | "phone" | "email"): Promise<IUser> => {
    try {
      const query = knex.select([
        "id", "first_name", "last_name", "email", "phone", "isVerified", "verification_code", "password_pin", "created_at", "deleted_at", "updated_at"
      ]).from(ETables.USERS)

      let user: IUser;

      switch (type) {
        case "id":
          user = await query.where<IUser>("id", value);
          break;
        case "email":
          user = await query.where<IUser>("email", value);
          break;
        case "phone":
          user = await query.where<IUser>("phone", value);
          break;
        default:
          user = await query.where<IUser>("id", null);
          break;
      }

      return user;
    } catch (error) {
      throw new Error(error)
    }
  }

  public DBUpdateUser = async (data: Partial<Omit<IUser, "id" | "updated_at" | "created_at">>, id: number): Promise<void> => {
    try {
      await knex.update(data).where("id", id).onConflict().merge()
    } catch (error) {
      throw new Error(error);
    }
  }

  public DBUpdateUserByEmail = async (data: Partial<Omit<IUser, "id" | "updated_at" | "created_at">>, email: string): Promise<void> => {
    try {
      await knex.update(data).where("email", email).onConflict().merge()
    } catch (error) {
      throw new Error(error);
    }
  }

}

@Service()
export class AuthAdapter {
  public DBGetUserByIdOrEmailOrPhone = async (value: string | number, type: "id" | "phone" | "email"): Promise<IUser | null> => {
    try {
      const query = knex.select([
        "id", "first_name", "last_name", "email", "phone", "isVerified", "verification_code", "password_pin", "created_at", "deleted_at", "updated_at"
      ]).from(ETables.USERS)

      let user: IUser;

      switch (type) {
        case "id":
          user = await query.where<IUser>("id", value);
          break;
        case "email":
          user = await query.where<IUser>("email", value);
          break;
        case "phone":
          user = await query.where<IUser>("phone", value);
          break;
        default:
          user = await query.where<IUser>("id", null);
          break;
      }

      return user;
    } catch (error) {
      console.log(error)
      return null;
    }
  }

}

@Service()
export class ValidationAdapter {
  public DBComparePassword = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await knex.select(["email", "password"]).from(ETables.USERS).where("email", email).first();

      if (!user) return false;
      return bcrypt.compareSync(password, user.password)
    } catch (error) {
      throw new Error(error);
    }
  }

  public DBGetUserByIdOrEmailOrPhone = async (value: string | number, type: "id" | "phone" | "email"): Promise<IUser> => {
    try {
      const query = knex.select([
        "id", "first_name", "last_name", "email", "phone", "isVerified", "verification_code", "password_pin", "created_at", "deleted_at", "updated_at"
      ]).from(ETables.USERS)

      let user: IUser;

      switch (type) {
        case "id":
          user = await query.where("id", value).first<IUser>();
          break;
        case "email":
          user = await query.where("email", value).first<IUser>();
          break;
        case "phone":
          user = await query.where("phone", value).first<IUser>();
          break;
        default:
          user = await query.where("id", null).first<IUser>();
          break;
      }

      return user;
    } catch (error) {
      throw new Error(error)
    }
  }
}

export default UserAdapter;
