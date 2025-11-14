import app from "./app.js";

app.listen(3000, (err) => {
  if (err) console.log(err.message);
  console.log("Server is up and running on port 3000...");
});
