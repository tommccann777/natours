const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNHANDLED REJECTION - Shutting down...");
  console.log(err.name, err.message, err.stack);
  // there's nothing more we can do here, so shut down the application
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

// console.log(app.get('env')); // Express environment
// console.log(process.env); // Node environment

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});

// The two error handlers are a safety net - we should be trying to catch exceptions where they occur
// handle all unhandled-rejection events
process.on("unhandledRejection", (err) => {
  console.log("UNCAUGHT EXEPTION - Shutting down...");
  console.log(err.name, err.message);
  // there's nothing more we can do here, so shut down the application
  // close the server
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("🤚 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
