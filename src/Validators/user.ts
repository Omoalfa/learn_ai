import { ValidationAdapter } from "@/Database/adapters/user";
import validate from "@/Utils/validate";
import { Service } from "typedi";

@Service()
class UserValidator {
  constructor (
    private readonly userAdapter: ValidationAdapter
  ) {}

  public validateCreateUser = validate({
    email: {
      in: ["body"],
      isEmail: { errorMessage: "Please enter a valid email" },
      custom: {
        options: async (email) => {
          try {
            const user = this.userAdapter.DBGetUserByIdOrEmailOrPhone(email, "email");

            if (user) throw new Error("Email already in use")
          } catch (error) {
            throw new Error(null);
          }
        }
      }
    },
    password: {
      in: ["body"],
      isLength: { options: { min: 8 }},
    },
    first_name: {
      in: ["body"],
      isString: true,
      notEmpty: true,
    },
    last_name: {
      in: ["body"],
      isString: true,
      notEmpty: true
    },
    phone: {
      in: ["body"],
      isMobilePhone: true,
    }
  })

  public validateLogin = validate({
    email: {
      in: ["body"],
      isEmail: { errorMessage: "Please enter a valid email" },
      custom: {
        options: async (email, { req }) => {
          try {
            const valid = this.userAdapter.DBComparePassword(email, req.body.password);

            if (!valid) throw new Error("Invalid credentials")
          } catch (error) {
            throw new Error("Invalid credentials");
          }
        }
      }
    },
    password: {
      in: ["body"],
      isLength: { options: { min: 8 }},
    }
  })
}

export default UserValidator;
