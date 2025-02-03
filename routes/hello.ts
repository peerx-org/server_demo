// All routes should be structured as follows
import { nexuRouter, sendMsg } from "nexujs";

const router = nexuRouter;

router.get("/", (req, res) => {
  // Try Changing this to `res.json`
  res.send("Hi 👋, Welcome to the Nexu.");
  console.log(sendMsg().log);
});

export default router;