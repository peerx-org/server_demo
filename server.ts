import { app, ErrorLogger, sendContent } from "nexujs";
import { UserRoutes } from "./routes";

app.use("/users", UserRoutes);

app.get("/", (req, res) => {
  res.send(sendContent);
});

app.use(ErrorLogger);
