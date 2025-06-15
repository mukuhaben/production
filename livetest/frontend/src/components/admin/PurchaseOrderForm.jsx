"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from "@mui/material"
import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon, Print as PrintIcon } from "@mui/icons-material"

// Sample suppliers data
const sampleSuppliers = [
  {
    id: 1,
    name: "Afri Supplies Ltd",
    contact: "John Kamau",
    email: "info@afrisupplies.co.ke",
    phone: "+254 722 123 456",
    address: "Industrial Area, Nairobi",
    city: "Nairobi",
    region: "Nairobi",
    country: "Kenya",
    postalCode: "00100",
  },
  {
    id: 2,
    name: "KB Stationery Ltd",
    contact: "Mary Wanjiku",
    email: "sales@kbstationery.co.ke",
    phone: "+254 733 987 654",
    address: "Mombasa Road, Nairobi",
    city: "Nairobi",
    region: "Nairobi",
    country: "Kenya",
    postalCode: "00200",
  },
  {
    id: 3,
    name: "Grier Marousek",
    contact: "Grier Marousek",
    email: "gmarousek1d@google.ru",
    phone: "414-149-2995",
    address: "17 Northport Hill",
    city: "Milwaukee",
    region: "Wisconsin",
    country: "United States",
    postalCode: "53225",
  },
]

// Sample products data
const sampleProducts = [
  {
    code: "L0202004",
    name: "Afri Multipurpose Labels K11 19*13mm White",
    category: "General Stationery",
    unitPrice: 50.0,
    taxRate: 16,
  },
  {
    code: "P0601005",
    name: "Afri Packing Tape (Brown) 48mm*100Mtr",
    category: "General Stationery",
    unitPrice: 165.0,
    taxRate: 16,
  },
  {
    code: "C0201003",
    name: "Counter Books KB A4 3 Quire REF 233",
    category: "General Stationery",
    unitPrice: 320.0,
    taxRate: 16,
  },
]

// Sample warehouses
const warehouses = [
  { id: 1, name: "Main Warehouse" },
  { id: 2, name: "Westlands Branch" },
  { id: 3, name: "Parklands Branch" },
]

/**
 * PurchaseOrderForm Component
 *
 * This component provides a form for creating and editing purchase orders.
 * It includes supplier selection, order details, and item management.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.open - Controls dialog visibility
 * @param {Function} props.onClose - Function to call when closing the dialog
 * @param {Function} props.onSave - Function to call when saving the purchase order
 * @param {Object} props.editPO - Purchase order data for editing (optional)
 */
const PurchaseOrderForm = ({ open, onClose, onSave, editPO = null }) => {
  // State for purchase order data
  const [purchaseOrder, setPurchaseOrder] = useState({
    poNumber: generatePONumber(),
    reference: "",
    orderDate: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
    supplier: null,
    warehouse: null,
    taxSetting: "on",
    discountSetting: "after-tax",
    notes: "",
    items: [
      {
        id: 1,
        productCode: "",
        productName: "",
        quantity: 1,
        rate: 0,
        taxPercent: 16,
        tax: 0,
        discount: 0,
        amount: 0,
      },
    ],
    totals: {
      subtotal: 0,
      totalTax: 0,
      totalDiscount: 0,
      grandTotal: 0,
    },
  })

  // State for notifications
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // State for supplier dialog
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false)
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    country: "",
    postalCode: "",
  })

  // Effect to populate form when editing
  useEffect(() => {
    if (editPO) {
      setPurchaseOrder(editPO)
    } else {
      // Reset form for new PO
      setPurchaseOrder({
        poNumber: generatePONumber(),
        reference: "",
        orderDate: new Date().toISOString().split("T")[0],
        dueDate: new Date().toISOString().split("T")[0],
        supplier: null,
        warehouse: null,
        taxSetting: "on",
        discountSetting: "after-tax",
        notes: "",
        items: [
          {
            id: 1,
            productCode: "",
            productName: "",
            quantity: 1,
            rate: 0,
            taxPercent: 16,
            tax: 0,
            discount: 0,
            amount: 0,
          },
        ],
        totals: {
          subtotal: 0,
          totalTax: 0,
          totalDiscount: 0,
          grandTotal: 0,
        },
      })
    }
  }, [editPO, open])

  // Effect to calculate totals when items change
  useEffect(() => {
    calculateTotals()
  }, [purchaseOrder.items])

  /**
   * Generates a unique purchase order number
   * @returns {string} Purchase order number
   */
  function generatePONumber() {
    const prefix = "PO"
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `${prefix}${timestamp}${random}`
  }

  /**
   * Calculates totals for the purchase order
   */
  const calculateTotals = () => {
    let subtotal = 0
    let totalTax = 0
    let totalDiscount = 0

    // Calculate item values and update them
    const updatedItems = purchaseOrder.items.map((item) => {
      const itemSubtotal = item.quantity * item.rate
      const itemTax = (itemSubtotal * item.taxPercent) / 100
      const itemDiscount = item.discount || 0
      const itemTotal = itemSubtotal + itemTax - itemDiscount

      subtotal += itemSubtotal
      totalTax += itemTax
      totalDiscount += itemDiscount

      return {
        ...item,
        tax: Number.parseFloat(itemTax.toFixed(2)),
        amount: Number.parseFloat(itemTotal.toFixed(2)),
      }
    })

    const grandTotal = subtotal + totalTax - totalDiscount

    setPurchaseOrder((prev) => ({
      ...prev,
      items: updatedItems,
      totals: {
        subtotal: Number.parseFloat(subtotal.toFixed(2)),
        totalTax: Number.parseFloat(totalTax.toFixed(2)),
        totalDiscount: Number.parseFloat(totalDiscount.toFixed(2)),
        grandTotal: Number.parseFloat(grandTotal.toFixed(2)),
      },
    }))
  }

  /**
   * Handles changes to purchase order fields
   * @param {string} field - Field name
   * @param {any} value - New value
   */
  const handlePOChange = (field, value) => {
    setPurchaseOrder((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  /**
   * Handles changes to item fields
   * @param {number} index - Item index
   * @param {string} field - Field name
   * @param {any} value - New value
   */
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...purchaseOrder.items]

    if (field === "productCode" && value) {
      // Find product by code
      const product = sampleProducts.find((p) => p.code === value)
      if (product) {
        updatedItems[index] = {
          ...updatedItems[index],
          productCode: product.code,
          productName: product.name,
          rate: product.unitPrice,
          taxPercent: product.taxRate,
        }
      }
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]:
          field === "quantity" || field === "rate" || field === "taxPercent" || field === "discount"
            ? Number.parseFloat(value) || 0
            : value,
      }
    }

    setPurchaseOrder((prev) => ({
      ...prev,
      items: updatedItems,
    }))
  }

  /**
   * Adds a new item to the purchase order
   */
  const addItem = () => {
    const newItem = {
      id: Date.now(),
      productCode: "",
      productName: "",
      quantity: 1,
      rate: 0,
      taxPercent: 16,
      tax: 0,
      discount: 0,
      amount: 0,
    }

    setPurchaseOrder((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))
  }

  /**
   * Removes an item from the purchase order
   * @param {number} index - Item index
   */
  const removeItem = (index) => {
    if (purchaseOrder.items.length > 1) {
      const updatedItems = purchaseOrder.items.filter((_, i) => i !== index)
      setPurchaseOrder((prev) => ({
        ...prev,
        items: updatedItems,
      }))
    }
  }

  /**
   * Handles supplier dialog open
   */
  const handleOpenSupplierDialog = () => {
    setSupplierDialogOpen(true)
  }

  /**
   * Handles supplier dialog close
   */
  const handleCloseSupplierDialog = () => {
    setSupplierDialogOpen(false)
    setNewSupplier({
      name: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      region: "",
      country: "",
      postalCode: "",
    })
  }

  /**
   * Handles new supplier form field changes
   * @param {string} field - Field name
   * @param {string} value - New value
   */
  const handleSupplierChange = (field, value) => {
    setNewSupplier((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  /**
   * Handles saving a new supplier
   */
  const handleSaveSupplier = () => {
    // In a real app, this would save to a database
    // For now, we'll just close the dialog and show a notification
    setNotification({
      open: true,
      message: "Supplier added successfully!",
      severity: "success",
    })
    handleCloseSupplierDialog()
  }

  /**
   * Handles saving the purchase order
   */
  const handleSave = () => {
    if (!purchaseOrder.supplier) {
      setNotification({
        open: true,
        message: "Please select a supplier",
        severity: "error",
      })
      return
    }

    if (!purchaseOrder.warehouse) {
      setNotification({
        open: true,
        message: "Please select a warehouse",
        severity: "error",
      })
      return
    }

    if (purchaseOrder.items.some((item) => !item.productCode)) {
      setNotification({
        open: true,
        message: "Please fill in all product details",
        severity: "error",
      })
      return
    }

    // Call the onSave function with the purchase order data
    onSave({
      ...purchaseOrder,
      status: "pending",
      createdAt: new Date().toISOString(),
    })

    onClose()
  }

  /**
   * Handles notification close
   */
  const handleNotificationClose = () => {
    setNotification({
      ...notification,
      open: false,
    })
  }

  /**
   * Formats currency values
   * @param {number} amount - Amount to format
   * @returns {string} Formatted amount
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">{editPO ? "Edit Purchase Order" : "Create Purchase Order"}</Typography>
            <Button variant="outlined" startIcon={<PrintIcon />}>
              Print Preview
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Supplier and Reference Section */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" sx={{ mb: 2, color: "#1976d2" }}>
                    Bill From
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Autocomplete
                      options={sampleSuppliers}
                      getOptionLabel={(option) => option.name}
                      value={purchaseOrder.supplier}
                      onChange={(event, newValue) => {
                        handlePOChange("supplier", newValue)
                      }}
                      renderInput={(params) => <TextField {...params} label="Search Supplier" fullWidth />}
                      sx={{ flexGrow: 1, mr: 1 }}
                    />
                    <Button variant="contained" size="small" onClick={handleOpenSupplierDialog}>
                      Add Supplier
                    </Button>
                  </Box>

                  {purchaseOrder.supplier && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Contact:</strong> {purchaseOrder.supplier.contact}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Email:</strong> {purchaseOrder.supplier.email}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Phone:</strong> {purchaseOrder.supplier.phone}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Address:</strong> {purchaseOrder.supplier.address}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" sx={{ mb: 2, color: "#1976d2" }}>
                    Purchase Order
                  </Typography>
                  <TextField
                    fullWidth
                    label="PO Number"
                    value={purchaseOrder.poNumber}
                    onChange={(e) => handlePOChange("poNumber", e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Reference"
                    value={purchaseOrder.reference}
                    onChange={(e) => handlePOChange("reference", e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Order Date"
                        type="date"
                        value={purchaseOrder.orderDate}
                        onChange={(e) => handlePOChange("orderDate", e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Due Date"
                        type="date"
                        value={purchaseOrder.dueDate}
                        onChange={(e) => handlePOChange("dueDate", e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>

            {/* Warehouse and Tax Settings */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Warehouse</InputLabel>
                  <Select
                    value={purchaseOrder.warehouse || ""}
                    label="Warehouse"
                    onChange={(e) => {
                      const selectedWarehouse = warehouses.find((w) => w.id === e.target.value)
                      handlePOChange("warehouse", selectedWarehouse)
                    }}
                  >
                    {warehouses.map((warehouse) => (
                      <MenuItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Tax</InputLabel>
                  <Select
                    value={purchaseOrder.taxSetting}
                    label="Tax"
                    onChange={(e) => handlePOChange("taxSetting", e.target.value)}
                  >
                    <MenuItem value="on">On</MenuItem>
                    <MenuItem value="off">Off</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Discount</InputLabel>
                  <Select
                    value={purchaseOrder.discountSetting}
                    label="Discount"
                    onChange={(e) => handlePOChange("discountSetting", e.target.value)}
                  >
                    <MenuItem value="before-tax">% Discount Before Tax</MenuItem>
                    <MenuItem value="after-tax">% Discount After Tax</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Notes */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={purchaseOrder.notes}
                onChange={(e) => handlePOChange("notes", e.target.value)}
              />
            </Paper>

            {/* Items Section */}
            <Paper sx={{ mb: 3, p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ color: "#1976d2" }}>
                  Order Items
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={addItem}>
                  Add Item
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                      <TableCell width="30%">Item Name</TableCell>
                      <TableCell width="10%">Quantity</TableCell>
                      <TableCell width="15%">Rate</TableCell>
                      <TableCell width="10%">Tax(%)</TableCell>
                      <TableCell width="10%">Tax</TableCell>
                      <TableCell width="10%">Discount</TableCell>
                      <TableCell width="10%">Amount</TableCell>
                      <TableCell width="5%">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseOrder.items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Autocomplete
                            options={sampleProducts}
                            getOptionLabel={(option) => `${option.code} - ${option.name}`}
                            onChange={(event, value) => {
                              if (value) {
                                handleItemChange(index, "productCode", value.code)
                              }
                            }}
                            renderInput={(params) => <TextField {...params} label="Select Product" size="small" />}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                            inputProps={{ min: 1, step: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                            inputProps={{ min: 0, step: 0.01 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={item.taxPercent}
                            onChange={(e) => handleItemChange(index, "taxPercent", e.target.value)}
                            inputProps={{ min: 0, max: 100, step: 1 }}
                          />
                        </TableCell>
                        <TableCell>{formatCurrency(item.tax)}</TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={item.discount}
                            onChange={(e) => handleItemChange(index, "discount", e.target.value)}
                            inputProps={{ min: 0, step: 0.01 }}
                          />
                        </TableCell>
                        <TableCell>{formatCurrency(item.amount)}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeItem(index)}
                            disabled={purchaseOrder.items.length === 1}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Totals Section */}
            <Grid container justifyContent="flex-end">
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body1">Subtotal:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">
                        {formatCurrency(purchaseOrder.totals.subtotal)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">Tax:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">
                        {formatCurrency(purchaseOrder.totals.totalTax)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">Discount:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">
                        {formatCurrency(purchaseOrder.totals.totalDiscount)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">Grand Total:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" align="right">
                        {formatCurrency(purchaseOrder.totals.grandTotal)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
            {editPO ? "Update" : "Save"} Purchase Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Supplier Dialog */}
      <Dialog open={supplierDialogOpen} onClose={handleCloseSupplierDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add New Supplier</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Supplier Name"
                value={newSupplier.name}
                onChange={(e) => handleSupplierChange("name", e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Contact Person"
                value={newSupplier.contact}
                onChange={(e) => handleSupplierChange("contact", e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newSupplier.email}
                onChange={(e) => handleSupplierChange("email", e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone"
                value={newSupplier.phone}
                onChange={(e) => handleSupplierChange("phone", e.target.value)}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Address"
                value={newSupplier.address}
                onChange={(e) => handleSupplierChange("address", e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="City"
                value={newSupplier.city}
                onChange={(e) => handleSupplierChange("city", e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Region/State"
                value={newSupplier.region}
                onChange={(e) => handleSupplierChange("region", e.target.value)}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={newSupplier.country}
                    onChange={(e) => handleSupplierChange("country", e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    value={newSupplier.postalCode}
                    onChange={(e) => handleSupplierChange("postalCode", e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSupplierDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveSupplier}>
            Save Supplier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleNotificationClose} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default PurchaseOrderForm
