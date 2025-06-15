import jwt from "jsonwebtoken"
const { sign } = jwt
import { hash } from "bcryptjs"
import db from "../database/models/index.js"

class ProductController {
  static uploadProducts = async (req, res) => {
    try {
      const {
        productName,
        productCode,
        description,
        longerDescription,
        categoryId,
        subcategoryId,
        costPrice,
        vatRate,
        stockUnits,
        alertQuantity,
        unitOfMeasure,
        packSize,
        productBarcode,
        etimsRefCode,
        expiryDate,
        preferredVendor1,
        preferredVendor2,
        vendorItemCode,
        cashbackRate,
        saCashback1stPurchase,
        saCashback2ndPurchase,
        saCashback3rdPurchase,
        saCashback4thPurchase,
        reorderLevel,
        orderLevel,
        reorderActive,
        pricingTiers,
      } = req.body

      // Check if product code already exists
      const existingProduct = await db.Product.findOne({
        where: { productCode },
      })

      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "Product code already exists",
        })
      }

      // Create product
      const newProduct = await db.Product.create({
        productName,
        productCode,
        description,
        longerDescription,
        categoryId,
        subcategoryId,
        costPrice,
        vatRate,
        stockUnits,
        alertQuantity,
        unitOfMeasure,
        packSize,
        productBarcode,
        etimsRefCode,
        expiryDate,
        preferredVendor1,
        preferredVendor2,
        vendorItemCode,
        cashbackRate,
        saCashback1stPurchase: saCashback1stPurchase || 6,
        saCashback2ndPurchase: saCashback2ndPurchase || 4,
        saCashback3rdPurchase: saCashback3rdPurchase || 3,
        saCashback4thPurchase: saCashback4thPurchase || 2,
        reorderLevel,
        orderLevel,
        reorderActive: reorderActive !== false,
        createdBy: req.user.id,
      })

      // Create pricing tiers if provided
      if (pricingTiers && pricingTiers.length > 0) {
        for (const tier of pricingTiers) {
          await db.ProductPricingTier.create({
            productId: newProduct.id,
            tierName: tier.tierName,
            minQuantity: tier.minQuantity,
            maxQuantity: tier.maxQuantity,
            sellingPrice: tier.sellingPrice,
          })
        }
      }

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: { product: newProduct },
      })
    } catch (error) {
      console.error("Upload products error:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to create product",
      })
    }
  }

  static signUp = async (req, res) => {
    const { email, password, userType, companyId } = req.body

    try {
      const existingUser = await db.User.findOne({ where: { email, userType } })

      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email is already in use" })
      }

      const hashedPassword = await hash(password, 10)

      const newUser = await db.User.create({
        email,
        password: hashedPassword,
        userType,
        companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const token = sign(
        { id: newUser.id, email: newUser.email, userType: newUser.userType, companyId: newUser.companyId },
        process.env.JWT_SECRET,
        {
          expiresIn: "23h",
        },
      )

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        companyId: newUser.companyId,
        userType: newUser.userType,
        user: newUser,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ success: false, message: "Failed to sign up" })
    }
  }
}

export default ProductController
