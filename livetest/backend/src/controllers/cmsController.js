import { CMSService } from "../services/cmsService.js"

export const cmsController = {
  // Get content by type
  async getContent(req, res, next) {
    try {
      const { type } = req.params
      const content = await CMSService.getContentByType(type)
      res.json({
        success: true,
        data: content,
      })
    } catch (error) {
      next(error)
    }
  },

  // Get navigation menu
  async getNavigationMenu(req, res, next) {
    try {
      const { location } = req.params
      const menu = await CMSService.getNavigationMenu(location)
      res.json({
        success: true,
        data: menu,
      })
    } catch (error) {
      next(error)
    }
  },

  // Get banners
  async getBanners(req, res, next) {
    try {
      const { type } = req.params
      const banners = await CMSService.getBanners(type)
      res.json({
        success: true,
        data: banners,
      })
    } catch (error) {
      next(error)
    }
  },

  // Get featured products
  async getFeaturedProducts(req, res, next) {
    try {
      const { section } = req.params
      const products = await CMSService.getFeaturedProducts(section)
      res.json({
        success: true,
        data: products,
      })
    } catch (error) {
      next(error)
    }
  },

  // Get public settings
  async getPublicSettings(req, res, next) {
    try {
      const settings = await CMSService.getPublicSettings()
      res.json({
        success: true,
        data: settings,
      })
    } catch (error) {
      next(error)
    }
  },

  // Create content
  async createContent(req, res, next) {
    try {
      const contentData = {
        ...req.body,
        created_by: req.user.id,
      }
      const content = await CMSService.createContent(contentData)
      res.status(201).json({
        success: true,
        data: content,
        message: "Content created successfully",
      })
    } catch (error) {
      next(error)
    }
  },

  // Update content
  async updateContent(req, res, next) {
    try {
      const { id } = req.params
      const updateData = {
        ...req.body,
        updated_by: req.user.id,
      }
      const content = await CMSService.updateContent(id, updateData)
      res.json({
        success: true,
        data: content,
        message: "Content updated successfully",
      })
    } catch (error) {
      next(error)
    }
  },

  // Delete content
  async deleteContent(req, res, next) {
    try {
      const { id } = req.params
      await CMSService.deleteContent(id)
      res.json({
        success: true,
        message: "Content deleted successfully",
      })
    } catch (error) {
      next(error)
    }
  },

  // Navigation menu methods
  async createNavigationMenu(req, res, next) {
    try {
      const menu = await CMSService.createNavigationMenu(req.body)
      res.status(201).json({
        success: true,
        data: menu,
        message: "Navigation menu created successfully",
      })
    } catch (error) {
      next(error)
    }
  },

  async updateNavigationMenu(req, res, next) {
    try {
      const { id } = req.params
      const menu = await CMSService.updateNavigationMenu(id, req.body)
      res.json({
        success: true,
        data: menu,
        message: "Navigation menu updated successfully",
      })
    } catch (error) {
      next(error)
    }
  },

  async deleteNavigationMenu(req, res, next) {
    try {
      const { id } = req.params
      await CMSService.deleteNavigationMenu(id)
      res.json({
        success: true,
        message: "Navigation menu deleted successfully",
      })
    } catch (error) {
      next(error)
    }
  },

  // Banner methods
  async createBanner(req, res, next) {
    try {
      const banner = await CMSService.createBanner(req.body)
      res.status(201).json({
        success: true,
        data: banner,
        message: "Banner created successfully",
      })
    } catch (error) {
      next(error)
    }
  },

  async updateBanner(req, res, next) {
    try {
      const { id } = req.params
      const banner = await CMSService.updateBanner(id, req.body)
      res.json({
        success: true,
        data: banner,
        message: "Banner updated successfully",
      })
    } catch (error) {
      next(error)
    }
  },

  async deleteBanner(req, res, next) {
    try {
      const { id } = req.params
      await CMSService.deleteBanner(id)
      res.json({
        success: true,
        message: "Banner deleted successfully",
      })
    } catch (error) {
      next(error)
    }
  },

  // Featured products methods
  async createFeaturedProduct(req, res, next) {
    try {
      const featured = await CMSService.createFeaturedProduct(req.body)
      res.status(201).json({
        success: true,
        data: featured,
        message: "Featured product created successfully",
      })
    } catch (error) {
      next(error)
    }
  },

  async updateFeaturedProduct(req, res, next) {
    try {
      const { id } = req.params
      const featured = await CMSService.updateFeaturedProduct(id, req.body)
      res.json({
        success: true,
        data: featured,
        message: "Featured product updated successfully",
      })
    } catch (error) {
      next(error)
    }
  },

  async deleteFeaturedProduct(req, res, next) {
    try {
      const { id } = req.params
      await CMSService.deleteFeaturedProduct(id)
      res.json({
        success: true,
        message: "Featured product deleted successfully",
      })
    } catch (error) {
      next(error)
    }
  },

  // Settings methods
  async getAllSettings(req, res, next) {
    try {
      const settings = await CMSService.getAllSettings()
      res.json({
        success: true,
        data: settings,
      })
    } catch (error) {
      next(error)
    }
  },

  async updateSettings(req, res, next) {
    try {
      const settings = await CMSService.updateSettings(req.body)
      res.json({
        success: true,
        data: settings,
        message: "Settings updated successfully",
      })
    } catch (error) {
      next(error)
    }
  },

  // Media methods
  async uploadMedia(req, res, next) {
    try {
      const mediaData = {
        ...req.body,
        uploaded_by: req.user.id,
      }
      const media = await CMSService.uploadMedia(req.file, mediaData)
      res.status(201).json({
        success: true,
        data: media,
        message: "Media uploaded successfully",
      })
    } catch (error) {
      next(error)
    }
  },

  async getMedia(req, res, next) {
    try {
      const { page = 1, limit = 20, type } = req.query
      const media = await CMSService.getMedia({ page, limit, type })
      res.json({
        success: true,
        data: media,
      })
    } catch (error) {
      next(error)
    }
  },

  async deleteMedia(req, res, next) {
    try {
      const { id } = req.params
      await CMSService.deleteMedia(id)
      res.json({
        success: true,
        message: "Media deleted successfully",
      })
    } catch (error) {
      next(error)
    }
  },
}
