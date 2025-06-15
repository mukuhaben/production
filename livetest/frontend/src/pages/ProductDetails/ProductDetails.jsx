"use client"

import { useState } from "react"
import {
  Grid,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Stack,
  Drawer,
  Slider,
  Box,
} from "@mui/material"
import { GridView, ViewList, FilterList } from "@mui/icons-material"

// Removed image imports - replaced with placeholder URLs for build stability
// import softChairsImage from '../../assets/images/1.png';
// import sofaChairImage from '../../assets/images/2.png';
// import kitchenDishesImage from '../../assets/images/11.png';
// import smartWatchesImage from '../../assets/images/8.png';
// import kitchenMixerImage from '../../assets/images/9.png';
// import blendersImage from '../../assets/images/12.png';
// import homeApplianceImage from '../../assets/images/10.png';
// import coffeeMakerImage from '../../assets/images/13.png';

const formatPrice = (price) => `${price.toFixed(2)}`

// Updated mockProducts array with placeholder images for build stability
const mockProducts = [
  {
    id: 1,
    name: "Soft Chairs",
    price: 49.99,
    originalPrice: 69.99,
    image: "/placeholder.svg?height=120&width=120", // Placeholder for soft chairs
    ranges: [{ cashback: 10 }],
  },
  {
    id: 2,
    name: "Sofa Chair",
    price: 89.99,
    image: "/placeholder.svg?height=120&width=120", // Placeholder for sofa chair
    ranges: [{ cashback: 5 }],
  },
  {
    id: 3,
    name: "Kitchen Dishes",
    price: 39.99,
    originalPrice: 49.99,
    image: "/placeholder.svg?height=120&width=120", // Placeholder for kitchen dishes
    ranges: [],
  },
  {
    id: 4,
    name: "Smart Watch",
    price: 99.99,
    image: "/placeholder.svg?height=120&width=120", // Placeholder for smart watch
    ranges: [{ cashback: 15 }],
  },
  {
    id: 5,
    name: "Kitchen Mixer",
    price: 59.99,
    image: "/placeholder.svg?height=120&width=120", // Placeholder for kitchen mixer
    ranges: [],
  },
  {
    id: 6,
    name: "Blenders",
    price: 34.99,
    originalPrice: 44.99,
    image: "/placeholder.svg?height=120&width=120", // Placeholder for blenders
    ranges: [{ cashback: 5 }],
  },
  {
    id: 7,
    name: "Home Appliance",
    price: 79.99,
    image: "/placeholder.svg?height=120&width=120", // Placeholder for home appliance
    ranges: [],
  },
  {
    id: 8,
    name: "Coffee Maker",
    price: 49.99,
    image: "/placeholder.svg?height=120&width=120", // Placeholder for coffee maker
    ranges: [{ cashback: 8 }],
  },
]

const CategoryCard = ({ category }) => (
  <Box
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      boxShadow: "none",
      border: "1px solid #f0f0f0",
      borderRadius: 2,
      p: 2,
      position: "relative",
      minHeight: 320, // Added fixed height for consistent alignment
      "&:hover": {
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      },
    }}
  >
    {category.ranges?.[0]?.cashback && (
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
          fontSize: 12, // Reduced from 18 to 12
          fontWeight: 700,
          zIndex: 1,
        }}
      >
        {category.ranges[0].cashback}% Cashback
      </Typography>
    )}

    {/* Fixed image container with consistent height */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 140, // Fixed height container
        mt: 4, // Reduced from 6
        mb: 1, // Reduced from 2
      }}
    >
      <img
        src={category.image || "/placeholder.svg"}
        alt={category.name}
        style={{
          maxWidth: "100%",
          maxHeight: 120,
          objectFit: "contain",
          margin: "auto", // Center image
        }}
      />
    </Box>

    {/* Reduced font size */}
    <Typography
      variant="body2"
      color="text.secondary"
      fontWeight="bold"
      sx={{ fontSize: "0.65rem" }} // Smaller font
    >
      Item code: XXXXX
    </Typography>

    {/* Reduced font size and added text truncation */}
    <Typography
      variant="body2" // Changed from body1
      sx={{
        fontWeight: 500,
        my: 1,
        fontSize: "0.75rem", // Smaller font
        lineHeight: 1.3,
        // Ensure description doesn't overflow
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {category.name} - This is a sample product description.
    </Typography>

    {/* Pricing section with smaller fonts */}
    <Box
      sx={{
        display: "flex",
        flexDirection: "row", // Always row to fit all prices
        justifyContent: "space-between",
        gap: 0.5, // Reduced gap
        mt: "auto", // Push to bottom of card
      }}
    >
      {[
        { label: "1-3 Pc", price: category.price },
        { label: "4-11 Pc", price: category.price * 1.05 },
        { label: "12+ Pc", price: category.price * 0.95 },
      ].map((tier, idx) => (
        <Box
          key={idx}
          sx={{
            flex: 1,
            border: "1px solid #e0e0e0", // Lighter border
            borderRadius: 1,
            p: 0.5, // Reduced padding
            textAlign: "center",
            fontSize: 10, // Reduced from 12
          }}
        >
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ fontSize: "0.6rem", whiteSpace: "nowrap" }} // Smaller font
          >
            {tier.label}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.6rem", // Smaller font
              whiteSpace: "nowrap",
            }}
          >
            {tier.price.toFixed(2)}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
)

const ProductList = () => {
  const [view, setView] = useState("grid")
  const [sort, setSort] = useState("")
  const [page, setPage] = useState(1)
  const [priceRange, setPriceRange] = useState([0, 100])
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleViewChange = (newView) => setView(newView)
  const handleSortChange = (e) => setSort(e.target.value)
  const handlePageChange = (event, value) => setPage(value)
  const handlePriceChange = (event, newValue) => setPriceRange(newValue)
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)

  return (
    <Box sx={{ p: 2, px: { xs: 2, md: 15 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Button startIcon={<FilterList />} onClick={toggleDrawer} sx={{ display: { xs: "inline-flex", md: "none" } }}>
            Filters
          </Button>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sort} onChange={handleSortChange} label="Sort By">
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack direction="row" spacing={1} justifyContent={{ xs: "center", sm: "flex-end" }}>
          <IconButton onClick={() => handleViewChange("grid")} color={view === "grid" ? "primary" : "default"}>
            <GridView />
          </IconButton>
          <IconButton onClick={() => handleViewChange("list")} color={view === "list" ? "primary" : "default"}>
            <ViewList />
          </IconButton>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={2} sx={{ display: { xs: "none", md: "block" } }}>
          <Typography variant="h6">Filters</Typography>
          <Typography variant="subtitle2">Price Range</Typography>
          <Slider value={priceRange} onChange={handlePriceChange} valueLabelDisplay="auto" min={0} max={200} />
        </Grid>

        <Grid item xs={12} md={10}>
          <Grid container spacing={2}>
            {mockProducts.map((product) => (
              <Grid item xs={12} sm={6} md={2.4} key={product.id}>
                {" "}
                {/* Changed from md={4} to md={2.4} for 5 cards per row */}
                <CategoryCard category={product} />
              </Grid>
            ))}
          </Grid>

          <Pagination
            count={5}
            page={page}
            onChange={handlePageChange}
            size="small"
            sx={{ display: "flex", justifyContent: "center", mt: 3 }}
          />
        </Grid>
      </Grid>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer} sx={{ display: { md: "none" } }}>
        <Stack sx={{ width: 250, p: 2 }} spacing={2}>
          <Typography variant="h6">Filters</Typography>
          <Typography variant="subtitle2">Price Range</Typography>
          <Slider value={priceRange} onChange={handlePriceChange} valueLabelDisplay="auto" min={0} max={200} />
          <Button variant="contained" onClick={toggleDrawer} fullWidth>
            Apply Filters
          </Button>
        </Stack>
      </Drawer>
    </Box>
  )
}

export default ProductList
