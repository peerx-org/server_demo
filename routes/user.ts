import {
  getBalance,
  getUser,
  getUsers,
  registerUser,
  transferEther,
} from "../controller/user";
import { nexuRouter, validateEmail, validateFields } from "nexujs";

const router = nexuRouter;

router.post(
  "/register",
  validateFields(["password", "email", "firstName", "lastName"]),
  validateEmail,
  registerUser
);

router.get("/current/:username", getUser);
router.get("/", getUsers);
router.get("/current/:username/balance", getBalance);
router.post(
  "/current/:username/transfer",
  validateFields(["toAddress", "amount"]),
  transferEther
);

export = router;
