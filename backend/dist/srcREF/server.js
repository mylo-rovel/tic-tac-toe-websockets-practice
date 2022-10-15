import http from "http";
import { app } from "./app.js";
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Listening to PORT ${PORT}... heh`);
});
