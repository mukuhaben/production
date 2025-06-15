import jwt from "jsonwebtoken"
import { query } from "../config/database.js"

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      })
    }

    const token = authHeader.substring(7)

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from database
    const result = await query("SELECT id, username, email, user_type, is_active FROM users WHERE id = $1", [
      decoded.userId,
    ])

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      })
    }

    const user = result.rows[0]

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      })
    }

    console.error("Auth middleware error:", error)
    res.status(500).json({
      success: false,
      message: "Authentication error",
    })
  }
}

// Check user role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      })
    }

    const userRoles = Array.isArray(roles) ? roles : [roles]

    if (!userRoles.includes(req.user.user_type)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      })
    }

    next()
  }
}

// Admin only middleware
const requireAdmin = requireRole("admin")

// Sales agent or admin middleware
const requireSalesAgentOrAdmin = requireRole(["sales_agent", "admin"])

// Customer, sales agent, or admin middleware
const requireAuthenticated = requireRole(["customer", "sales_agent", "admin"])

export { verifyToken, requireRole, requireAdmin, requireSalesAgentOrAdmin, requireAuthenticated }
