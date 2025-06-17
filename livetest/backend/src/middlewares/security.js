import rateLimit from "express-rate-limit"
import helmet from "helmet"
import { AppError } from "./errorHandler.js"

// Rate limiting configuration
export const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100, message = "Too many requests") => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
}

// Specific rate limits for different endpoints
export const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  "Too many authentication attempts, please try again later",
)

export const apiLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  "Too many API requests, please try again later",
)

export const uploadLimiter = createRateLimit(
  60 * 60 * 1000, // 1 hour
  10, // 10 uploads
  "Too many file uploads, please try again later",
)

// Security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
})

// Input sanitization
export const sanitizeInput = (req, res, next) => {
  // Remove any potential XSS attacks
  const sanitize = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitize(obj[key])
      }
    }
  }

  if (req.body) sanitize(req.body)
  if (req.query) sanitize(req.query)
  if (req.params) sanitize(req.params)

  next()
}

// Validate file uploads
export const validateFileUpload = (allowedTypes = [], maxSize = 10 * 1024 * 1024) => {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      return next()
    }

    const files = req.files || [req.file]

    for (const file of files) {
      // Check file size
      if (file.size > maxSize) {
        return next(new AppError(`File size too large. Maximum size is ${maxSize / 1024 / 1024}MB`, 400))
      }

      // Check file type
      if (allowedTypes.length > 0) {
        const fileExtension = file.originalname.split(".").pop().toLowerCase()
        if (!allowedTypes.includes(fileExtension)) {
          return next(new AppError(`File type not allowed. Allowed types: ${allowedTypes.join(", ")}`, 400))
        }
      }
    }

    next()
  }
}

// CORS configuration
export const corsOptions = {
  origin: (origin, callback) => {
    
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.CORS_ORIGIN,
      
      "http://localhost:3000",
      "http://localhost:5173",
      "https://production-kappa.vercel.app",
      "http://127.0.0.1:5173",
    ].filter(Boolean)

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new AppError("Not allowed by CORS", 403))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}
