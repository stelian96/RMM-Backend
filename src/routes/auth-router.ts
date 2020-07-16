import { Router } from "express";
import { AppError } from "../model/errors";
import { UserRepository } from "../dao/mongo-repository";
import * as indicative from "indicative";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { secret } from "../config/secret";
import { Role } from "../model/user.model";
import Credentials from "../model/auth";

const router = Router();

// Auth API Feature
router.post("/login", async (req, res, next) => {
  const db = req.app.locals.db;
  const credentials = req.body as Credentials;
  try {
    await indicative.validator.validate(credentials, {
      username: "required",
      password: "required|string|min:6",
    });
  } catch (err) {
    next(new AppError(400, err.message, err));
    return;
  }
  try {
    const user = await (<UserRepository>req.app.locals.userRepo).findByUsername(
      credentials.username
    );
    if (!user) {
      next(new AppError(401, `Username or password is incorrect.`));
      return;
    }
    const passIsValid = await bcrypt.compare(
      credentials.password,
      user.password
    );
    if (!passIsValid) {
      next(new AppError(401, `Username or password is incorrect.`));
      return;
    }
    const token = jwt.sign({ id: user._id }, secret, {
      expiresIn: 3600, //expires in 24 h
    });
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
});

// router.post("/register", async (req, res, next) => {
//   // validate new user
//   const newUser = req.body;
//   try {
//     await indicative.validator.validate(newUser, {
//       _id: "regex:^[0-9a-fA-F]{24}$",
//       fullName: "required|string|min:4|max:24",
//       username: "required|string|min:5|max:24",
//       password: "required|string|min:6",
//       email: "required|email",
//       phone: "required|string|min:10|max:14",
//       address: "required|string|min:6|max:95",
//     });
//   } catch (err) {
//     next(new AppError(400, err.message, err));
//     return;
//   }
//   // create user in db
//   try {
//     const found = await (<UserRepository>(
//       req.app.locals.userRepo
//     )).findByUsername(newUser.username);
//     if (found) {
//       throw new AppError(400, `Username already taken: "${newUser.username}".`);
//     }

//     throw new AppError(400, `Can not change username.`);

//     // hash password
//     newUser.password = await bcrypt.hash(newUser.password, 8);
//     newUser.roles = [Role.CUSTOMER];

//     // Create new User
//     const created = await (<UserRepository>req.app.locals.userRepo).add(
//       newUser
//     );
//     delete created.password;

//     res.status(201).location(`/api/users/${newUser.id}`).json(newUser);
//   } catch (err) {
//     next(err);
//   }
// });

export default router;
