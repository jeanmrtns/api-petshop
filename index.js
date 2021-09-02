const customExpress = require("./config/customExpress");
const conn = require("./infra/connection");
const Tables = require("./infra/tables");

conn.connect((error) => {
  if (error) console.log(error);
  else {
    console.log("Connected with success to database");

    Tables.init(conn);

    const app = customExpress();

    app.listen(3000, () => {
      console.log("Running on port 3000");
    });
  }
});
