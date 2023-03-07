const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });
const user = require("./model/user");
const app = require("./app");

const db = process.env.DB_ADDRESS.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD
);

(async () => {
  try {
    await mongoose.connect(db);

    console.log("Database connection successfull");
  } catch (err) {
    console.log(err);
  }
})();

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App Listning to port: ${port}`);
});
