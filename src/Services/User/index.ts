import UserAdapter from "@/Database/adapters/user";
import { IUser } from "@/Types";
import { Service } from "typedi";
import bcrypt from "bcrypt";
import { generatePin, generateToken } from "@/Utils/helper";
import { sendMail } from "@/Utils/mailer";

@Service()
class UserServices {
  constructor(
    private readonly userAdapter: UserAdapter
  ) {}

  public async createUserService (data: IUser) {
    try {
      const password = bcrypt.hashSync(data.password, 10);
      const verification_code = generatePin();
      const [user] = await this.userAdapter.DBCreateUser({ ...data, password, verification_code });

      delete user.password;

      //send email verification::
      sendMail({ to: user.email, subject: "Verification Mail", text: "Please verify your mail with the following pin: " + user.verificatin_code })

      return user;
    } catch (error) {
      throw error;
    }
  }

  public async getUserByIdService (id: number) {
    try {
      const user = await this.userAdapter.DBGetUserByIdOrEmailOrPhone(id, "id");

      return user;
    } catch (error) {
      throw error;
    }
  }

  public async loginUserService (email: string) {
    try {
      const user = await this.userAdapter.DBGetUserByIdOrEmailOrPhone(email, "email");

      const token = generateToken(user.id, user.email);

      return token;
    } catch (error) {
      throw error;
    }
  }

  public async updateUserPassword (password: string, id: number) {
    try {
      await this.userAdapter.DBUpdateUser({ password, password_pin: null }, id);
    } catch (error) {
      throw error;
    }
  }

  public async verifyUserEmailService (id: number) {
    try {
      await this.userAdapter.DBUpdateUser({ is_verified: true, verification_code: null }, id);
    } catch (error) {
      throw error;
    }
  }

  public async initializeForgetPassowrdService (email: string) {
    try {
      const password_pin = generatePin();

      ///send pin to email
      sendMail({ to: email, subject: "Password Reset", text: `Use this pin "${password_pin}" to reset your password` })

      await this.userAdapter.DBUpdateUserByEmail({ password_pin }, email);
    } catch (error) {
      throw error;
    }
  }

  public async resendVerificationCodeService (email: string) {
    try {
      const verification_code = generatePin();

      ///send pin to email
      sendMail({ to: email, subject: "Verification Mail", text: "Please verify your mail with the following pin: " + verification_code })

      await this.userAdapter.DBUpdateUserByEmail({ verification_code }, email);
    } catch (error) {
      throw error;
    }
  }

}

export default UserServices;
