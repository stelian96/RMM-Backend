import { Router } from "express";
import { AppError } from "../model/errors";
import { OrderRepository } from "../dao/mongo-repository";
import * as indicative from "indicative";
import { verifyToken } from "./verify-token";
import { verifyRole } from "./verify-role";
import { Role } from "../model/user.model";

const router = Router();

router.get("/", (req, res, next) =>
  (<OrderRepository>req.app.locals.orderRepo)
    .findAll()
    .then((orders) => res.json(orders))
    .catch(next)
);

router.get("/:id", async (req, res, next) => {
  // validate id
  try {
    const id = req.params.id;
    await indicative.validator.validate(
      { id },
      {
        id: "required|regex:^[0-9a-fA-F]{24}$",
      }
    );
  } catch (err) {
    next(new AppError(400, err.message, err));
    return;
  }
  // find post
  try {
    const found = await (<OrderRepository>req.app.locals.orderRepo).findById(
      req.params.id
    );
    res.json(found); //200 OK with deleted post in the body
  } catch (err) {
    next(err);
  }
});

// router.post("/", verifyToken, verifyRole([Role.MANAGER]), function (
//   req,
//   res,
//   next
// ) {

router.post("/", function (
  req,
  res,
  next
) {
  // validate new post
  const newItem = req.body;
  indicative.validator
    .validate(newItem, {
      _id: "regex:^[0-9a-fA-F]{24}$",
    })
    .then(async () => {
      // create post in db
      try {
        //TODO set correct author
        // const defaultUser = await (<UserRepository>req.app.locals.userRepo).findByUsername("trayan");
        // newPost.authorId = defaultUser._id;

        // Create new User
        const created = await (<OrderRepository>req.app.locals.orderRepo).add(
          newItem
        );

        res.status(201).location(`/api/menu/${newItem.id}`).json(newItem);
      } catch (err) {
        next(err);
      }
    })
    .catch((err) => next(new AppError(400, err.message, err)));
});

router.put("/:id", async function (req, res, next) {
  // validate edited post
  const order = req.body;
  try {
    await indicative.validator.validate(order, {
    //   _id: "regex:^[0-9a-fA-F]{24}$",
      //  _id: "required|string",
      // category: "required|string|min:3|max:30",
      // imageUrl: "required|url",
      // foodName: "required|string|min:3|max:60",
      // description: "required|string|min:3|max:128",
      // price: "required|string|min:1|max:6",
    });
  } catch (err) {
    next(new AppError(400, err.message, err));
    return;
  }

  try {
    const orderId = req.params.id;

    if (orderId !== order._id) {
      next(new AppError(400, `IDs in the URL and message body are different.`));
      return;
    }
    const found = await (<OrderRepository>req.app.locals.orderRepo).findById(
      req.params.id
    );
  
    order._id = found._id;
    const updated = await (<OrderRepository>req.app.locals.orderRepo).edit(order);
    res.json(updated); //200 OK with post in the body
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async function (req, res, next) {
  // validate id
  try {
    const id = req.params.id;
    await indicative.validator.validate(
      { id },
      {
        id: "required|regex:^[0-9a-fA-F]{24}$",
      }
    );
  } catch (err) {
    next(new AppError(400, err.message, err));
    return;
  }
  try {
    const orderId = req.params.id;
    const deleted = await (<OrderRepository>req.app.locals.orderRepo).deleteById(
        orderId
    );
    res.json(deleted); //200 OK with deleted post in the body
  } catch (err) {
    next(err);
  }
});

export default router;