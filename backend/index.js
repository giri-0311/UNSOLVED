const express= require("express")
const app = express();
const mongoose = require("mongoose")
const routes = require("./routes")
const port = 3000;
const cors= require("cors");
const dotenv = require("dotenv");
dotenv.config(); 

mongoose.connect(process.env.DATABASE_URL);

app.use(express.json());
app.use(cors());
app.use('/', routes);

app.listen(3000, () => {
    console.log(`Server is running on port ${port}`);
});