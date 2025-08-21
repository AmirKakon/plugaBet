const { app } = require("../../../setup");

app.get("/api/auth/login",  async (req, res) => {
        const { username, password } = req.query;
    if (username === "kakischer" && password === "Kakon1948") {
        res.status(200).send("Login successful");
    } else {
        res.status(401).send("Invalid credentials");
    }
});