import { fetchUserByUsername } from "../utils/user";
import { postgresClient, query } from "../config/postgresClient";
import { hashPassword } from "../utils/hashPassword";
import { decrypt, processRequest, throwError } from "nexujs";
import {
  createWallet,
  getEvmBalance,
  sendEther,
} from "../services/wallet_services";

// TODO: Refactor codebase for readability

const registerUser = processRequest({
  async action(req, res) {
    try {
      const { firstName, lastName, email, password, username } = req.body;
      const { privateKey, address, phrase } = createWallet();

      const hashedPass = await hashPassword(password);
      // TODO: Also include username in check
      const userIndb = await query(`SELECT * FROM users WHERE email=$1`, [
        email,
      ]);
      if (userIndb?.rowCount === 0) {
        const result = await query(
          `INSERT INTO users(email, firstName, lastName, password, private_key, phrase, address, balance, username)
           VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
           RETURNING id, email, firstName, lastName, balance, username, address, created_at`,
          [
            email,
            firstName,
            lastName,
            hashedPass,
            privateKey,
            phrase,
            address,
            0.0,
            username,
          ]
        );
        if (result?.rowCount !== 0) {
          return res
            .status(201)
            .json({ message: "User Created", data: result?.rows[0] });
        }
        return throwError({
          res,
          status: "402",
          error: "Something went wrong",
        });
      } else {
        return throwError({
          res,
          status: "403",
          error: "Email already in use",
        });
      }
    } catch (error) {
      return throwError({ res, error, status: "500" });
    }
  },
});

const getUser = processRequest({
  async action(req, res) {
    try {
      const user = await fetchUserByUsername({
        req,
        columns:
          "email, firstName, lastName, address, balance, created_at, username",
      });
      if (user) {
        res.status(200).json({ data: user });
      }
    } catch (error) {
      return throwError({ res, error, status: "500" });
    }
  },
});

const getUsers = processRequest({
  async action(req, res) {
    try {
      const users = await postgresClient.useQueryLimit({
        req,
        table: "users",
        columns_list:
          "email, firstName, lastName, balance, created_at, username",
      });

      res.status(200).json({
        message: "Users data fetched successfully",
        length: users?.rowCount,
        data: users?.rows,
      });
    } catch (error) {
      return throwError({ res, error, status: "500" });
    }
  },
});

const getBalance = processRequest({
  async action(req, res) {
    try {
      const user = await fetchUserByUsername({
        req,
        columns: "balance, address",
      });
      const balance = await getEvmBalance(user?.address);

      await query(`UPDATE users SET balance =$1 WHERE username =$2`, [
        balance,
        req.params.username,
      ]);

      res.status(200).json(balance);
    } catch (error) {
      return throwError({ res, error, status: "500" });
    }
  },
});

const transferEther = processRequest({
  async action(req, res) {
    try {
      const { toAddress, amount } = req.body;
      const user = await fetchUserByUsername({ req, columns: "private_key" });
      if (user) {
        const privateKey = decrypt(user?.private_key);
        const { message, receipt } = await sendEther(
          privateKey,
          toAddress,
          amount
        );
        if (message === "success") {
          res.status(200).json({ message, receipt });
        } else {
          res.status(401).json({ message: "Transcation failed" });
        }
      }
    } catch (error) {
      return throwError({ res, error, status: "500" });
    }
  },
});

export { registerUser, getUser, getUsers, getBalance, transferEther };
