"use client"

import { useState, useEffect } from "react"
import { Box, Card, Typography, CardMedia, Button, Snackbar, Alert, useTheme, Skeleton } from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import { productsAPI, cmsAPI } from "../../services/api"

// Helper function to format numbers with commas
const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const ProductCategories = ({ header, section = "featured" }) => {
  const theme = useTheme()
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [section])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      let response
      if (section === "featured") {
        response = await cmsAPI.getFeaturedProducts({ section: header })
      } else {
        response = await productsAPI.getAll({
          limit: 10,
          featured: true,
          category: section,
        })
      }

      if (response.data.success) {
        setProducts(response.data.data.products || response.data.data || [])
      } else {
        throw new Error("Failed to load products")
      }
    } catch (err) {
      console.error("Error loading products:", err)
      setError(err.message)
      // Fallback to empty array to prevent crashes
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Function to add item to cart
  const addToCart = (product) => {
    try {
      // Create a cart item from the product
      const cartItem = {
        id: product.id,
        name: product.product_name || product.name,
        size: "medium",
        color: "blue",
        material: "Plastic",
        seller: "FirstCraft",
        price: product.pricing_tiers?.[0]?.sellingPrice || product.price || 0,
        basePrice: product.pricing_tiers?.[0]?.sellingPrice || product.price || 0,
        cashbackPercent: product.cashback_rate || 5,
        image: product.images?.[0]?.imageUrl || product.image || "/placeholder.svg?height=130&width=130",
        itemCode: product.product_code || `PROD-${product.id}`,
        pricingTiers: product.pricing_tiers || [],
      }

      // Get existing cart items from localStorage or initialize empty array
      const existingCartItems = JSON.parse(localStorage.getItem("cartItems")) || []

      // Add new item to cart
      const updatedCart = [...existingCartItems, cartItem]

      // Save updated cart to localStorage
      localStorage.setItem("cartItems", JSON.stringify(updatedCart))

      // Show notification
      setSnackbarMessage(`${cartItem.name} added to cart! You'll earn ${cartItem.cashbackPercent}% cashback.`)
      setSnackbarOpen(true)
    } catch (err) {
      console.error("Error adding to cart:", err)
      setSnackbarMessage("Failed to add item to cart")
      setSnackbarOpen(true)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const CategoryCard = ({ product }) => {
    const pricingTiers = product.pricing_tiers || []
    const mainImage = product.images?.[0]?.imageUrl || product.image || "/placeholder.svg?height=130&width=130"
    const cashbackRate = product.cashback_rate || 5

    return (
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: "none",
          border: "1px solid #f0f0f0",
          borderRadius: 2,
          p: 2,
          position: "relative",
          minHeight: 320,
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
        }}
      >
        {/* Cashback Badge */}
        <Typography
          variant="body2"
          color="white"
          fontWeight="bold"
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            backgroundColor: "red",
            borderRadius: 1,
            px: 1.5,
            py: 0.5,
            fontSize: "0.9rem",
            fontWeight: 700,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            zIndex: 1,
          }}
        >
          {cashbackRate}% Cashback
        </Typography>

        {/* Image - Fixed consistent height */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 150,
            mt: 4,
            mb: 1,
          }}
        >
          <CardMedia
            component="img"
            image={mainImage}
            alt={product.product_name || product.name}
            sx={{
              maxWidth: 130,
              maxHeight: 130,
              objectFit: "contain",
              margin: "auto",
            }}
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=130&width=130"
            }}
          />
        </Box>

        {/* Item code */}
        <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ fontSize: "0.85rem" }}>
          Item code: {product.product_code || `PROD-${product.id}`}
        </Typography>

        {/* Item description */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            my: 1,
            fontSize: "0.95rem",
            lineHeight: 1.3,
          }}
        >
          {product.product_name || product.name} - {product.description || "Quality product from FirstCraft"}
        </Typography>

        {/* Pricing section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: "auto",
            mb: 1,
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "table",
              tableLayout: "fixed",
              borderCollapse: "separate",
              borderSpacing: "4px",
            }}
          >
            <Box sx={{ display: "table-row" }}>
              {pricingTiers.length > 0
                ? pricingTiers.slice(0, 3).map((tier, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "table-cell",
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        p: 0.5,
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          lineHeight: 1.2,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tier.minQuantity}-{tier.maxQuantity || "∞"} PC
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          lineHeight: 1.2,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatNumberWithCommas(tier.sellingPrice.toFixed(0))}/=
                      </Typography>
                    </Box>
                  ))
                : // Fallback pricing if no tiers available
                  [
                    { label: "1-3 PC", price: product.price || 1000 },
                    { label: "4-11 PC", price: (product.price || 1000) * 0.95 },
                    { label: "12 PC+", price: (product.price || 1000) * 0.9 },
                  ].map((tier, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "table-cell",
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        p: 0.5,
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          lineHeight: 1.2,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tier.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          lineHeight: 1.2,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatNumberWithCommas(tier.price.toFixed(0))}/=
                      </Typography>
                    </Box>
                  ))}
            </Box>
          </Box>
        </Box>

        {/* Add to Cart Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={() => addToCart(product)}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            fontSize: "0.9rem",
            py: 0.8,
            mt: 1,
            textTransform: "none",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          ADD TO CART
        </Button>
      </Card>
    )
  }

  // Loading skeleton
  const LoadingSkeleton = () => (
    <Card sx={{ height: 320, p: 2 }}>
      <Skeleton variant="rectangular" height={150} sx={{ mb: 2 }} />
      <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={40} />
    </Card>
  )

  // Error fallback
  if (error && products.length === 0) {
    return (
      <Box sx={{ px: { xs: 2, sm: 4, md: 6 }, py: 2 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mb: 2, fontSize: { xs: "1.4rem", sm: "1.6rem" }, fontWeight: "bold" }}
        >
          {header}
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load products. Please try again later.
        </Alert>
        <Button variant="contained" onClick={loadProducts}>
          Retry
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 6 }, py: 2 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mb: 2,
          fontSize: { xs: "1.4rem", sm: "1.6rem" },
          fontWeight: "bold",
        }}
      >
        {header}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
          {[...Array(5)].map((_, index) => (
            <Box key={index} sx={{ minWidth: 250 }}>
              <LoadingSkeleton />
            </Box>
          ))}
        </Box>
      ) : (
        <Swiper
          spaceBetween={20}
          loop={products.length > 5}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          modules={[Autoplay, Navigation]}
          style={{ padding: "10px 0" }}
          breakpoints={{
            0: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
            1200: { slidesPerView: 5 },
          }}
        >
          {products.length > 0 ? (
            products.map((product) => (
              <SwiperSlide key={product.id}>
                <CategoryCard product={product} />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No products available
                </Typography>
              </Box>
            </SwiperSlide>
          )}
        </Swiper>
      )}

      {/* Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ProductCategories
