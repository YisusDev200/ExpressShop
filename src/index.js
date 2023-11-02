const app = require("./app");
const { PORT } = require("./config");

// * Start the server
app.listen(PORT ?? 4000, () => {
  console.log(`Server running on port ${PORT ?? 4000}`);
});
