"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Divider,
  Alert,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tabs,
  Tab,
} from "@mui/material"
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
} from "@mui/icons-material"

/**
 * TabPanel Component for supplier details tabs
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`supplier-tabpanel-${index}`}
      aria-labelledby={`supplier-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

/**
 * SupplierManagementEnhanced Component
 *
 * Enhanced supplier management component with detailed supplier information,
 * purchase order viewing, and transaction history based on the provided screenshots.
 */
const SupplierManagement = () => {
  // State for suppliers data
  const [suppliers, setSuppliers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [supplierFormData, setSupplierFormData] = useState({
    name: "",
    company: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    country: "",
    postalCode: "",
  })
  const [isAdd, setIsAdd] = useState(false)
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" })

  // State for supplier details view
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsTabValue, setDetailsTabValue] = useState(0)

  // State for sorting
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" })
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null)

  // State for purchase orders and transactions
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [transactions, setTransactions] = useState([])
  const [viewPODialogOpen, setViewPODialogOpen] = useState(false)
  const [selectedPO, setSelectedPO] = useState(null)
  const [viewTransactionDialogOpen, setViewTransactionDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  /**
   * Initialize sample data based on the provided screenshots
   */
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        // Sample suppliers data based on the screenshot
        const mockSuppliers = [
          {
            id: 1,
            name: "Grier Marousek",
            company: "Grier Enterprises",
            contact: "Grier Marousek",
            email: "gmarousek1d@google.ru",
            phone: "414-149-2995",
            address: "17 Northport Hill",
            city: "Milwaukee",
            region: "Wisconsin",
            country: "United States",
            postalCode: "53225",
            createdAt: "2023-05-15T10:30:00Z",
            balance: 0,
            income: 0,
            expenses: 0,
          },
          {
            id: 2,
            name: "Afri Supplies Ltd",
            company: "Afri Supplies Ltd",
            contact: "John Kamau",
            email: "info@afrisupplies.co.ke",
            phone: "+254 722 123 456",
            address: "Industrial Area, Nairobi",
            city: "Nairobi",
            region: "Nairobi",
            country: "Kenya",
            postalCode: "00100",
            createdAt: "2023-06-20T14:45:00Z",
            balance: 15000,
            income: 45000,
            expenses: 30000,
          },
          {
            id: 3,
            name: "KB Stationery Ltd",
            company: "KB Stationery Ltd",
            contact: "Mary Wanjiku",
            email: "sales@kbstationery.co.ke",
            phone: "+254 733 987 654",
            address: "Mombasa Road, Nairobi",
            city: "Nairobi",
            region: "Nairobi",
            country: "Kenya",
            postalCode: "00200",
            createdAt: "2023-07-05T09:15:00Z",
            balance: 8500,
            income: 32000,
            expenses: 23500,
          },
          {
            id: 4,
            name: "Office Solutions Kenya",
            company: "Office Solutions Kenya Ltd",
            contact: "Peter Mwangi",
            email: "peter@officesolutions.co.ke",
            phone: "+254 711 555 123",
            address: "Westlands, Nairobi",
            city: "Nairobi",
            region: "Nairobi",
            country: "Kenya",
            postalCode: "00600",
            createdAt: "2023-08-10T11:20:00Z",
            balance: 12000,
            income: 28000,
            expenses: 16000,
          },
        ]
        setSuppliers(mockSuppliers)

        // Sample purchase orders
        const mockPurchaseOrders = [
          {
            id: "PO001",
            poNumber: "PO001",
            supplierId: 1,
            supplierName: "Grier Marousek",
            orderDate: "2024-06-01",
            dueDate: "2024-06-15",
            status: "pending",
            totalAmount: 1537.0,
            reference: "1001",
            warehouse: "Main Warehouse",
            tax: "16%",
            discount: "5%",
            items: [
              {
                productCode: "L0202004",
                productName: "Afri Multipurpose Labels K11 19*13mm White",
                quantity: 10,
                rate: 50.0,
                taxRate: 16,
                discount: 0,
                amount: 580.0,
              },
              {
                productCode: "P0601005",
                productName: "Afri Packing Tape (Brown) 48mm*100Mtr",
                quantity: 5,
                rate: 165.0,
                taxRate: 16,
                discount: 0,
                amount: 957.0,
              },
            ],
            paymentTerms: "Payment On Receipt",
            updateStock: true,
            notes: "Urgent delivery required for client project",
          },
          {
            id: "PO002",
            poNumber: "PO002",
            supplierId: 2,
            supplierName: "Afri Supplies Ltd",
            orderDate: "2024-06-02",
            dueDate: "2024-06-16",
            status: "delivered",
            totalAmount: 7424.0,
            reference: "1002",
            warehouse: "Main Warehouse",
            tax: "16%",
            discount: "0%",
            items: [
              {
                productCode: "C0201003",
                productName: "Counter Books KB A4 3 Quire REF 233",
                quantity: 20,
                rate: 320.0,
                taxRate: 16,
                discount: 0,
                amount: 7424.0,
              },
            ],
            paymentTerms: "Net 30",
            updateStock: true,
            notes: "Regular monthly order",
          },
          {
            id: "PO003",
            poNumber: "PO003",
            supplierId: 3,
            supplierName: "KB Stationery Ltd",
            orderDate: "2024-05-15",
            dueDate: "2024-05-30",
            status: "completed",
            totalAmount: 2500.0,
            reference: "1003",
            warehouse: "Secondary Warehouse",
            tax: "16%",
            discount: "2%",
            items: [
              {
                productCode: "P0401001",
                productName: "Petty Cash Voucher White A6 Ref 283",
                quantity: 50,
                rate: 39.0,
                taxRate: 16,
                discount: 0,
                amount: 2275.0,
              },
              {
                productCode: "DELIVERY",
                productName: "Delivery Charges",
                quantity: 1,
                rate: 225.0,
                taxRate: 16,
                discount: 0,
                amount: 225.0,
              },
            ],
            paymentTerms: "Payment On Receipt",
            updateStock: true,
            notes: "Special order for new client",
          },
        ]
        setPurchaseOrders(mockPurchaseOrders)

        // Sample transactions
        const mockTransactions = [
          {
            id: "TRX001",
            supplierId: 1,
            supplierName: "Grier Marousek",
            date: "2024-06-05",
            type: "payment",
            amount: 1537.0,
            reference: "PO001",
            description: "Payment for Purchase Order PO001",
            status: "completed",
            paymentMethod: "Bank Transfer",
            invoiceNumber: "INV-001",
          },
          {
            id: "TRX002",
            supplierId: 2,
            supplierName: "Afri Supplies Ltd",
            date: "2024-06-10",
            type: "payment",
            amount: 7424.0,
            reference: "PO002",
            description: "Payment for Purchase Order PO002",
            status: "completed",
            paymentMethod: "Cheque",
            invoiceNumber: "INV-002",
          },
          {
            id: "TRX003",
            supplierId: 3,
            supplierName: "KB Stationery Ltd",
            date: "2024-05-25",
            type: "payment",
            amount: 2500.0,
            reference: "PO003",
            description: "Payment for Purchase Order PO003",
            status: "completed",
            paymentMethod: "Cash",
            invoiceNumber: "INV-003",
          },
          {
            id: "TRX004",
            supplierId: 1,
            supplierName: "Grier Marousek",
            date: "2024-06-15",
            type: "refund",
            amount: 150.0,
            reference: "REF001",
            description: "Refund for damaged goods",
            status: "pending",
            paymentMethod: "Bank Transfer",
            invoiceNumber: "REF-001",
          },
          {
            id: "TRX005",
            supplierId: 4,
            supplierName: "Office Solutions Kenya",
            date: "2024-06-20",
            type: "payment",
            amount: 3200.0,
            reference: "PO004",
            description: "Payment for office furniture",
            status: "completed",
            paymentMethod: "Mobile Money",
            invoiceNumber: "INV-004",
          },
        ]
        setTransactions(mockTransactions)
      } catch (error) {
        console.error("Error fetching suppliers:", error)
        setAlert({ open: true, message: "Error fetching suppliers", severity: "error" })
      }
    }

    fetchSuppliers()
  }, [])

  /**
   * Handle search input change
   * @param {Event} event - Input change event
   */
  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  /**
   * Filter suppliers based on search term
   */
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.country.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  /**
   * Handle sorting configuration
   * @param {string} key - The field to sort by
   */
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
    setSortMenuAnchor(null)
  }

  /**
   * Sort suppliers based on current sort configuration
   */
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    if (sortConfig.key) {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      // Handle date sorting
      if (sortConfig.key === "createdAt") {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      // Handle numeric sorting
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
      }

      // Handle string sorting
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
    }
    return 0
  })

  /**
   * Handle supplier form submission
   * @param {Event} event - Form submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault()

    if (isAdd) {
      // Add new supplier
      const newSupplier = {
        id: Date.now(),
        ...supplierFormData,
        createdAt: new Date().toISOString(),
        balance: 0,
        income: 0,
        expenses: 0,
      }
      setSuppliers([...suppliers, newSupplier])
      setAlert({ open: true, message: "Supplier added successfully!", severity: "success" })
    } else {
      // Update existing supplier
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === selectedSupplier.id ? { ...supplier, ...supplierFormData } : supplier,
        ),
      )
      setAlert({ open: true, message: "Supplier updated successfully!", severity: "success" })
    }

    handleCloseDialog()
  }

  /**
   * Handle opening add supplier dialog
   */
  const handleAddSupplier = () => {
    setSupplierFormData({
      name: "",
      company: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      region: "",
      country: "",
      postalCode: "",
    })
    setIsAdd(true)
    setOpenDialog(true)
  }

  /**
   * Handle opening edit supplier dialog
   * @param {Object} supplier - The supplier to edit
   */
  const handleEditSupplier = (supplier) => {
    setSelectedSupplier(supplier)
    setSupplierFormData({
      name: supplier.name,
      company: supplier.company,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      city: supplier.city,
      region: supplier.region,
      country: supplier.country,
      postalCode: supplier.postalCode,
    })
    setIsAdd(false)
    setOpenDialog(true)
  }

  /**
   * Handle viewing supplier details
   * @param {Object} supplier - The supplier to view
   */
  const handleViewSupplier = (supplier) => {
    setSelectedSupplier(supplier)
    setDetailsOpen(true)
    setDetailsTabValue(0)
  }

  /**
   * Handle viewing purchase orders for a supplier
   * @param {Object} supplier - The supplier to view purchase orders for
   */
  const handleViewPurchaseOrders = (supplier) => {
    setSelectedSupplier(supplier)
    setDetailsOpen(true)
    setDetailsTabValue(1)
  }

  /**
   * Handle viewing transactions for a supplier
   * @param {Object} supplier - The supplier to view transactions for
   */
  const handleViewTransactions = (supplier) => {
    setSelectedSupplier(supplier)
    setDetailsOpen(true)
    setDetailsTabValue(2)
  }

  /**
   * Handle viewing specific purchase order
   * @param {Object} po - The purchase order to view
   */
  const handleViewPO = (po) => {
    setSelectedPO(po)
    setViewPODialogOpen(true)
  }

  /**
   * Handle viewing specific transaction
   * @param {Object} transaction - The transaction to view
   */
  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction)
    setViewTransactionDialogOpen(true)
  }

  /**
   * Handle closing dialogs
   */
  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedSupplier(null)
    setSupplierFormData({
      name: "",
      company: "",
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
   * Handle deleting supplier
   * @param {number} supplierId - The ID of the supplier to delete
   */
  const handleDeleteSupplier = (supplierId) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== supplierId))
    setAlert({ open: true, message: "Supplier deleted successfully!", severity: "success" })
  }

  /**
   * Format currency values
   * @param {number} amount - The amount to format
   * @returns {string} Formatted currency string
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  /**
   * Get supplier's purchase orders
   * @param {number} supplierId - The supplier ID
   * @returns {Array} Array of purchase orders for the supplier
   */
  const getSupplierPurchaseOrders = (supplierId) => {
    return purchaseOrders.filter((po) => po.supplierId === supplierId)
  }

  /**
   * Get supplier's transactions
   * @param {number} supplierId - The supplier ID
   * @returns {Array} Array of transactions for the supplier
   */
  const getSupplierTransactions = (supplierId) => {
    return transactions.filter((transaction) => transaction.supplierId === supplierId)
  }

  /**
   * Get status color for chips
   * @param {string} status - The status to get color for
   * @returns {string} Material-UI color name
   */
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success"
      case "pending":
        return "warning"
      case "delivered":
        return "info"
      case "cancelled":
        return "error"
      default:
        return "default"
    }
  }

  return (
    <Box sx={{ width: "100%", bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <Paper sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ p: 3, bgcolor: "#1976d2", color: "white" }}>
          <Typography variant="h5" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            Supplier Management
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
            Manage supplier information, purchase orders, and transactions
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Box sx={{ p: 3, bgcolor: "#f5f5f5" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Card sx={{ bgcolor: "#e3f2fd", borderLeft: "4px solid #1976d2" }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BusinessIcon color="primary" />
                    <Box>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        {suppliers.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Suppliers
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card sx={{ bgcolor: "#e8f5e8", borderLeft: "4px solid #4caf50" }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ReceiptIcon color="success" />
                    <Box>
                      <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                        {purchaseOrders.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Purchase Orders
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card sx={{ bgcolor: "#fff3e0", borderLeft: "4px solid #ff9800" }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PaymentIcon color="warning" />
                    <Box>
                      <Typography variant="h6" color="warning.main" sx={{ fontWeight: 600 }}>
                        {transactions.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Transactions
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card sx={{ bgcolor: "#e1f5fe", borderLeft: "4px solid #03a9f4" }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccountBalanceIcon color="info" />
                    <Box>
                      <Typography variant="h6" color="info.main" sx={{ fontWeight: 600 }}>
                        {formatCurrency(suppliers.reduce((sum, supplier) => sum + supplier.balance, 0))}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Balance
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Controls */}
      <Paper sx={{ mb: 3, p: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif" }}>
            Supplier List
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSupplier}
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Add Supplier
          </Button>
        </Box>

        {/* Search and Sort Controls */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search suppliers by name, company, email, phone, or location..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SortIcon />}
              onClick={(e) => setSortMenuAnchor(e.currentTarget)}
              size="small"
            >
              Sort by {sortConfig.key} ({sortConfig.direction})
            </Button>
          </Grid>
        </Grid>

        {/* Alert Messages */}
        {alert.open && (
          <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        {/* Supplier Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contact Info</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Balance</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedSuppliers.map((supplier) => (
                <TableRow key={supplier.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "#1976d2" }}>
                        <BusinessIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {supplier.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {supplier.company}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Contact: {supplier.contact}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2">{supplier.email}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">{supplier.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="body2">
                          {supplier.city}, {supplier.region}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {supplier.country} - {supplier.postalCode}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color:
                          supplier.balance > 0 ? "success.main" : supplier.balance < 0 ? "error.main" : "text.primary",
                      }}
                    >
                      {formatCurrency(supplier.balance)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={supplier.balance >= 0 ? "Active" : "Outstanding"}
                      color={supplier.balance >= 0 ? "success" : "warning"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleViewSupplier(supplier)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Supplier">
                        <IconButton size="small" onClick={() => handleEditSupplier(supplier)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Purchase Orders">
                        <IconButton size="small" onClick={() => handleViewPurchaseOrders(supplier)}>
                          <ReceiptIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Transactions">
                        <IconButton size="small" onClick={() => handleViewTransactions(supplier)}>
                          <PaymentIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Supplier">
                        <IconButton size="small" color="error" onClick={() => handleDeleteSupplier(supplier.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {sortedSuppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary">No suppliers found matching your search criteria.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Sort Menu */}
      <Menu anchorEl={sortMenuAnchor} open={Boolean(sortMenuAnchor)} onClose={() => setSortMenuAnchor(null)}>
        <MenuItem onClick={() => handleSort("name")}>
          <ListItemIcon>
            {sortConfig.key === "name" && sortConfig.direction === "asc" ? <TrendingUpIcon /> : <TrendingDownIcon />}
          </ListItemIcon>
          <ListItemText>Sort by Name</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSort("company")}>
          <ListItemIcon>
            {sortConfig.key === "company" && sortConfig.direction === "asc" ? <TrendingUpIcon /> : <TrendingDownIcon />}
          </ListItemIcon>
          <ListItemText>Sort by Company</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSort("city")}>
          <ListItemIcon>
            {sortConfig.key === "city" && sortConfig.direction === "asc" ? <TrendingUpIcon /> : <TrendingDownIcon />}
          </ListItemIcon>
          <ListItemText>Sort by City</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSort("balance")}>
          <ListItemIcon>
            {sortConfig.key === "balance" && sortConfig.direction === "asc" ? <TrendingUpIcon /> : <TrendingDownIcon />}
          </ListItemIcon>
          <ListItemText>Sort by Balance</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSort("createdAt")}>
          <ListItemIcon>
            {sortConfig.key === "createdAt" && sortConfig.direction === "asc" ? (
              <TrendingUpIcon />
            ) : (
              <TrendingDownIcon />
            )}
          </ListItemIcon>
          <ListItemText>Sort by Date Created</ListItemText>
        </MenuItem>
      </Menu>

      {/* Add/Edit Supplier Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">{isAdd ? "Add New Supplier" : "Edit Supplier"}</Typography>
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Supplier Name"
                  value={supplierFormData.name}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={supplierFormData.company}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, company: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Person"
                  value={supplierFormData.contact}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, contact: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={supplierFormData.email}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={supplierFormData.phone}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, phone: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  value={supplierFormData.postalCode}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, postalCode: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={supplierFormData.address}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, address: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={supplierFormData.city}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, city: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Region/State"
                  value={supplierFormData.region}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, region: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Country"
                  value={supplierFormData.country}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, country: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isAdd ? "Add Supplier" : "Update Supplier"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Supplier Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">{selectedSupplier?.name} - Supplier Details</Typography>
            <IconButton onClick={() => setDetailsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedSupplier && (
            <Box>
              {/* Supplier Header Info */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "#f8f9fa" }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: "center" }}>
                      <Avatar sx={{ width: 120, height: 120, mx: "auto", mb: 2, bgcolor: "#1976d2" }}>
                        <BusinessIcon sx={{ fontSize: 60 }} />
                      </Avatar>
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mb: 2 }}>
                        <Button variant="contained" size="small" startIcon={<EmailIcon />}>
                          Send Message
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<PaymentIcon />}>
                          Bulk Payment
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<EditIcon />}>
                          Edit Profile
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                      Supplier Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Name
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedSupplier.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Company
                        </Typography>
                        <Typography variant="body1">{selectedSupplier.company}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Address
                        </Typography>
                        <Typography variant="body1">{selectedSupplier.address}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          City
                        </Typography>
                        <Typography variant="body1">{selectedSupplier.city}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Region
                        </Typography>
                        <Typography variant="body1">{selectedSupplier.region}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Country
                        </Typography>
                        <Typography variant="body1">{selectedSupplier.country}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Postal Code
                        </Typography>
                        <Typography variant="body1">{selectedSupplier.postalCode}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1">{selectedSupplier.email}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Phone
                        </Typography>
                        <Typography variant="body1">{selectedSupplier.phone}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Balance Summary */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Balance Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ p: 2, bgcolor: "#e8f5e8", textAlign: "center" }}>
                        <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                          {formatCurrency(selectedSupplier.income)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Income
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ p: 2, bgcolor: "#ffebee", textAlign: "center" }}>
                        <Typography variant="h6" color="error.main" sx={{ fontWeight: 600 }}>
                          {formatCurrency(selectedSupplier.expenses)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Expenses
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ p: 2, bgcolor: "#e3f2fd", textAlign: "center" }}>
                        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                          {formatCurrency(selectedSupplier.balance)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Balance
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    startIcon={<ReceiptIcon />}
                    onClick={() => handleViewPurchaseOrders(selectedSupplier)}
                  >
                    View Purchase Orders
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PaymentIcon />}
                    onClick={() => handleViewTransactions(selectedSupplier)}
                  >
                    View Transactions
                  </Button>
                </Box>
              </Paper>

              {/* Tabs for Purchase Orders and Transactions */}
              <Paper sx={{ borderRadius: 2 }}>
                <Tabs
                  value={detailsTabValue}
                  onChange={(event, newValue) => setDetailsTabValue(newValue)}
                  aria-label="supplier details tabs"
                >
                  <Tab label="Overview" />
                  <Tab label="Purchase Orders" />
                  <Tab label="Transactions" />
                </Tabs>

                {/* Overview Tab */}
                <TabPanel value={detailsTabValue} index={0}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Supplier Overview
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                          Recent Activity
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Last purchase order:{" "}
                          {getSupplierPurchaseOrders(selectedSupplier.id).length > 0
                            ? getSupplierPurchaseOrders(selectedSupplier.id)[0].orderDate
                            : "No orders yet"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total purchase orders: {getSupplierPurchaseOrders(selectedSupplier.id).length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total transactions: {getSupplierTransactions(selectedSupplier.id).length}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                          Contact Information
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Primary contact: {selectedSupplier.contact}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Email: {selectedSupplier.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Phone: {selectedSupplier.phone}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </TabPanel>

                {/* Purchase Orders Tab */}
                <TabPanel value={detailsTabValue} index={1}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6">
                      Purchase Orders ({getSupplierPurchaseOrders(selectedSupplier.id).length})
                    </Typography>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                          <TableCell>PO Number</TableCell>
                          <TableCell>Order Date</TableCell>
                          <TableCell>Due Date</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getSupplierPurchaseOrders(selectedSupplier.id).map((po) => (
                          <TableRow key={po.id}>
                            <TableCell sx={{ fontWeight: 500, fontFamily: "monospace" }}>{po.poNumber}</TableCell>
                            <TableCell>{po.orderDate}</TableCell>
                            <TableCell>{po.dueDate}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(po.totalAmount)}</TableCell>
                            <TableCell>
                              <Chip
                                label={po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                                color={getStatusColor(po.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip title="View Purchase Order">
                                <IconButton size="small" onClick={() => handleViewPO(po)}>
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                        {getSupplierPurchaseOrders(selectedSupplier.id).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                              <Typography color="text.secondary">
                                No purchase orders found for this supplier.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>

                {/* Transactions Tab */}
                <TabPanel value={detailsTabValue} index={2}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6">
                      Transactions ({getSupplierTransactions(selectedSupplier.id).length})
                    </Typography>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                          <TableCell>Transaction ID</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Reference</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getSupplierTransactions(selectedSupplier.id).map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell sx={{ fontWeight: 500, fontFamily: "monospace" }}>{transaction.id}</TableCell>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>
                              <Chip
                                label={transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                color={transaction.type === "payment" ? "success" : "warning"}
                                size="small"
                              />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(transaction.amount)}</TableCell>
                            <TableCell>{transaction.reference}</TableCell>
                            <TableCell>
                              <Chip
                                label={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                color={getStatusColor(transaction.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip title="View Transaction">
                                <IconButton size="small" onClick={() => handleViewTransaction(transaction)}>
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                        {getSupplierTransactions(selectedSupplier.id).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                              <Typography color="text.secondary">No transactions found for this supplier.</Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* View Purchase Order Dialog */}
      <Dialog open={viewPODialogOpen} onClose={() => setViewPODialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Purchase Order Details</Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedPO?.poNumber}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPO && (
            <Box>
              {/* Purchase Order Header */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "#f8f9fa" }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Purchase Order Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          PO Number
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedPO.poNumber}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Reference
                        </Typography>
                        <Typography variant="body1">{selectedPO.reference}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Order Date
                        </Typography>
                        <Typography variant="body1">{selectedPO.orderDate}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Due Date
                        </Typography>
                        <Typography variant="body1">{selectedPO.dueDate}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Warehouse
                        </Typography>
                        <Typography variant="body1">{selectedPO.warehouse}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Status
                        </Typography>
                        <Chip
                          label={selectedPO.status.charAt(0).toUpperCase() + selectedPO.status.slice(1)}
                          color={getStatusColor(selectedPO.status)}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Supplier Information
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedPO.supplierName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tax: {selectedPO.tax} | Discount: {selectedPO.discount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Payment Terms: {selectedPO.paymentTerms}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Update Stock: {selectedPO.updateStock ? "Yes" : "No"}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Items Table */}
              <Paper sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
                  Order Items
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                        <TableCell>Item Name</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Rate</TableCell>
                        <TableCell>Tax(%)</TableCell>
                        <TableCell>Tax</TableCell>
                        <TableCell>Discount</TableCell>
                        <TableCell>Amount($)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedPO.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {item.productName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Code: {item.productCode}
                            </Typography>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.rate)}</TableCell>
                          <TableCell>{item.taxRate}%</TableCell>
                          <TableCell>{formatCurrency((item.amount * item.taxRate) / 100)}</TableCell>
                          <TableCell>{formatCurrency(item.discount)}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(item.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              {/* Order Summary */}
              <Paper sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    {selectedPO.notes && (
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          Notes
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedPO.notes}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Order Summary
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2">Total Tax:</Typography>
                        <Typography variant="body2">
                          {formatCurrency(
                            selectedPO.items.reduce((sum, item) => sum + (item.amount * item.taxRate) / 100, 0),
                          )}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2">Total Discount:</Typography>
                        <Typography variant="body2">
                          {formatCurrency(selectedPO.items.reduce((sum, item) => sum + item.discount, 0))}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Grand Total:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatCurrency(selectedPO.totalAmount)}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewPODialogOpen(false)}>Close</Button>
          <Button variant="outlined">Print</Button>
          <Button variant="contained">Download PDF</Button>
        </DialogActions>
      </Dialog>

      {/* View Transaction Dialog */}
      <Dialog
        open={viewTransactionDialogOpen}
        onClose={() => setViewTransactionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Transaction Details</Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedTransaction?.id}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Box>
              {/* Transaction Header */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: "#f8f9fa" }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Transaction Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Transaction ID
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: "monospace" }}>
                          {selectedTransaction.id}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="body1">{selectedTransaction.date}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Type
                        </Typography>
                        <Chip
                          label={selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)}
                          color={selectedTransaction.type === "payment" ? "success" : "warning"}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Amount
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                          {formatCurrency(selectedTransaction.amount)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Status
                        </Typography>
                        <Chip
                          label={
                            selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)
                          }
                          color={getStatusColor(selectedTransaction.status)}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Payment Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Supplier
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedTransaction.supplierName}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Reference
                        </Typography>
                        <Typography variant="body1">{selectedTransaction.reference}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Payment Method
                        </Typography>
                        <Typography variant="body1">{selectedTransaction.paymentMethod}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Invoice Number
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                          {selectedTransaction.invoiceNumber}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>

              {/* Transaction Description */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Description
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {selectedTransaction.description}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewTransactionDialogOpen(false)}>Close</Button>
          <Button variant="outlined">Print Receipt</Button>
          <Button variant="contained">Download PDF</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SupplierManagement
