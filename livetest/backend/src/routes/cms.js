import { Router } from "express"
import { cmsController } from "../controllers/cmsController.js"
import { authenticate, authorize } from "../middlewares/auth.js"
import { validateCMSContent } from "../middlewares/validation.js"

const router = Router()

// Public CMS endpoints
router.get("/content/:type", cmsController.getContent)
router.get("/navigation/:location", cmsController.getNavigationMenu)
router.get("/banners/:type?", cmsController.getBanners)
router.get("/featured-products/:section?", cmsController.getFeaturedProducts)
router.get("/settings/public", cmsController.getPublicSettings)
router.get('/navigation', cmsController.getNavigation)


// Protected CMS endpoints (Admin only)
router.use(authenticate)
router.use(authorize(["admin"]))

router.post("/content", validateCMSContent, cmsController.createContent)
router.put("/content/:id", validateCMSContent, cmsController.updateContent)
router.delete("/content/:id", cmsController.deleteContent)

router.post("/navigation", cmsController.createNavigationMenu)
router.put("/navigation/:id", cmsController.updateNavigationMenu)
router.delete("/navigation/:id", cmsController.deleteNavigationMenu)

router.post("/banners", cmsController.createBanner)
router.put("/banners/:id", cmsController.updateBanner)
router.delete("/banners/:id", cmsController.deleteBanner)

router.post("/featured-products", cmsController.createFeaturedProduct)
router.put("/featured-products/:id", cmsController.updateFeaturedProduct)
router.delete("/featured-products/:id", cmsController.deleteFeaturedProduct)

router.get("/settings", cmsController.getAllSettings)
router.put("/settings", cmsController.updateSettings)

// Media management
router.post("/media/upload", cmsController.uploadMedia)
router.get("/media", cmsController.getMedia)
router.delete("/media/:id", cmsController.deleteMedia)

export default router
