import server from "./server.js";

const port = parseInt(process.env.PORT!) || 3000;

server.listen(port, '0.0.0.0', () => {
    console.log(`Server is listening on port: ${port}`);
});