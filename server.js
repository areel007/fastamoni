import mongoose from "mongoose";

import app from "./app.js";
const PORT = process.env.PORT || 3131;

const DB = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(DB).then((con) => {
  console.log("DB connection succesful");
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
