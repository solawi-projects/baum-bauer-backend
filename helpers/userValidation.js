import { body, param, validationResult } from "express-validator";
import { changeToUpperCase } from "./generalSanitizers.js";
import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import { ObjectId } from "mongodb";
/**
 * Validations for the fields of user
 */
export const allUserFieldValidator = [
  body(["firstName", "lastName"])
    .trim()
    .notEmpty()
    .withMessage("FirstName and LastName should not be empty..!")
    .isLength({ min: 3, max: 20 })
    .withMessage(
      "The length of FirsName and LastName should be between 3 and 20"
    )
    .customSanitizer((value) => changeToUpperCase(value)),
  body("city").trim().notEmpty().withMessage("city is required"),
  body("zipCode").trim().notEmpty().withMessage("zipCode is required"),
  body("address1").trim().notEmpty().withMessage("Address Line 1 is required!"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email should not be empty...!")
    .isEmail()
    .withMessage("This field is an email address..!")
    .custom(async (value) => {
      const isThisEmailExist = await User.findOne({ email: value });
      if (isThisEmailExist) {
        throw new Error(`A user with email address ${value} already exist!`);
      }
    }),
  body("mobilePhone")
    .trim()
    .notEmpty()
    .withMessage("Mobile Number Should not be empty..!"),
  // .isMobilePhone('de-DE')
  // .withMessage('Only Germany Phone Number is accepted..!'),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password should not be empty..!")
    .isStrongPassword()
    .withMessage(
      "Password needs to contain at least 8 characters, minimum one lower case character, minimum one uppercase character, minimum one number and minimum one symbol."
    ),
  body("passwordConfirmation")
    .trim()
    .notEmpty()
    .withMessage("Password Confirmation should not left empty..!")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("password should match with Confirm Password");
      }
      return true;
    }),
];

/**
 * this function is used for parameter Validation
 * @returns
 */
export const parameterValidator = [
  param("uId").custom((value) => {
    // the parameter need to be only from ObjectId type
    if (!ObjectId.isValid(value)) {
      throw new Error("Parameter can be only of type ObjectId");
    }
    return true;
  }),
];


export const loginUserValidator = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('provide an email'),
    body('password')
        .trim()
        .isStrongPassword()
        .withMessage('Password should be strong')

];

/**
 * for validating
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const validateResultUser = (req, res, next) => {
  const errors = validationResult(req);
  //if there are errors
  if (!errors.isEmpty()) {
    //response code 400
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  // if there is not any error, should pass the control to next middleware
  next();
};
