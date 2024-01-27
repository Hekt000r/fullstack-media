import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import { error } from "console"
import authRoutes from "./routes/auth.js"
import { register } from "./controllers/auth.js"
import { verifyToken } from "./middleware/auth.js"
import userRoutes from "./routes/user.js"

// config
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin", }))
app.use(morgan("common"))
app.use(cors())
app.use(bodyParser.json({limit: "30mb", extended: "true"}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: "true"}))
app.use("/assets", express.static(path.join(__dirname, `/public/assets`)))

// file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function (req,file,cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({storage})

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
// file routes
app.post("/auth/register", upload.single("picture"), register)


//setup mongoose

const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL, {}).then(() => {
    app.listen(PORT, () => {console.log("Connected at port", PORT, "http://localhost:3001")})
}).catch((err) => {
    console.log("An error has occurred:", err)
})