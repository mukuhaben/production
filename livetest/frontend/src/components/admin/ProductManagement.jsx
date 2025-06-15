"use client"
import { useState } from "react"
import { Box, Typography, Button, Paper } from "@mui/material"
import { Add, ShoppingCart, UploadFile } from "@mui/icons-material"
import BulkImportModal from "./BulkImportModal" // Import the modal component

const ProductManagement = ({ viewMode, onAddNewItem }) => {
  const [showBulkImportModal, setShowBulkImportModal] = useState(false)

  const handleOpenBulkImportModal = () => {
    setShowBulkImportModal(true)
  }

  const handleCloseBulkImportModal = () => {
    setShowBulkImportModal(false)
  }

  return (
    <Box>
      {/* Header with Add New Item Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          {viewMode === "manage" ? "Manage Items" : "Product Management"}
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAddNewItem}
            sx={{
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#1565c0" },
              textTransform: "none",
              fontWeight: 500,
              px: 3,
              mr: 1, // Add margin to separate buttons
            }}
          >
            Add New Item
          </Button>
          <Button
            variant="outlined"
            startIcon={<UploadFile />}
            onClick={handleOpenBulkImportModal}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              px: 3,
            }}
          >
            Bulk Import
          </Button>
        </Box>
      </Box>

      {/* Rest of the component content */}
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <ShoppingCart sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Product Management Interface
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Product listing and management features will be available here.
        </Typography>
      </Paper>

      {/* Bulk Import Modal */}
      <BulkImportModal
        open={showBulkImportModal}
        onClose={handleCloseBulkImportModal}
      />
    </Box>
  )
}

export default ProductManagement
