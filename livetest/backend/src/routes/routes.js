import { Router } from "express"
const routes = Router()
import Authentication from "../middlewares/Authentication.js"
import Product from "../controllers/product.js"
import cmsRoutes from "./cms.js"

// Routes
routes.post("/auth/login", Authentication.handleLogin)
routes.post("/auth/signUp", Authentication.signUp)

routes.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is up and running!",
  })
})

routes.post("/admin/upload", Product.uploadProduct)

// CMS Routes
routes.use("/cms", cmsRoutes)

// sample routes request.
// routes.get(
//     '/companies/:companyId',
//     authenticate,
//     Companies.viewAllCompanies,
// );

export default routes
