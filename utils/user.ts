import { query } from "../config/postgresClient";
import { NexuRequest } from "nexujs";

type FetchUser = {
  req: NexuRequest;
  columns: string;
};

export const fetchUserByUsername = async ({ req, columns }: FetchUser) => {
  const { username } = req.params;
  if (!username) {
    throw new Error("Username is required");
  }

  const user = await query(`SELECT ${columns} FROM users WHERE username=$1`, [
    username,
  ]);

  if (user?.rowCount === 0) {
    throw new Error("User not found");
  }

  return user?.rows[0];
};

type UpdateProps = {
  req: NexuRequest;
  column: string;
  where: string;
  values?: any[];
};

export const updateUser = async ({
  req,
  column,
  where,
  values,
}: UpdateProps) => {};
