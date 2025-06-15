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
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Menu,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material"
import GoodsReceivedNoteForm from "./GoodsReceivedNoteForm"

/**
 * TabPanel Component for organizing GRN management sections
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {number} props.value - Current tab value
 * @param {number} props.index - Tab index
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`grn-tabpanel-${index}`}
      aria-labelledby={`grn-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

/**
 * GRNManagement Component
 *
 * Comprehensive Goods Received Note management system with full CRUD operations,
 * sorting capabilities, filtering, and detailed view functionality.
 * Integrates seamlessly with the existing admin panel structure.
 */
const GRNManagement = () => {
  // State management for GRN data and UI
  const [grns, setGrns] = useState([])
  const [filteredGrns, setFilteredGrns] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "receiveDate", direction: "desc" })
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedGrn, setSelectedGrn] = useState(null)
  const [tabValue, setTabValue] = useState(0)

  // Dialog and form states
  const [grnFormOpen, setGrnFormOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingGrn, setEditingGrn] = useState(null)

  // Menu states for sorting and filtering
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null)
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null)

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  /**
   * Initialize sample GRN data on component mount
   * This simulates data that would typically come from a backend API
   */
  useEffect(() => {
    const sampleGRNs = [
      {
        id: "GRN001",
        grnNumber: "GRN-2024-001",
        reference: "PO-2024-001",
        receiveDate: "2024-06-15",
        purchaseOrder: {
          id: "PO001",
          poNumber: "PO-2024-001",
          supplier: {
            name: "Afri Supplies Ltd",
            contact: "John Kamau",
            email: "info@afrisupplies.co.ke",
            phone: "+254 722 123 456",
          },
        },
        warehouse: { id: 1, name: "Main Warehouse" },
        receivedBy: "John Doe",
        items: [
          {
            id: 1,
            productCode: "L0202004",
            productName: "Afri Multipurpose Labels K11 19*13mm White",
            orderedQuantity: 10,
            receivedQuantity: 10,
            pendingQuantity: 0,
            rate: 50.0,
            amount: 500.0,
            status: "complete",
          },
          {
            id: 2,
            productCode: "P0601005",
            productName: "Afri Packing Tape (Brown) 48mm*100Mtr",
            orderedQuantity: 5,
            receivedQuantity: 4,
            pendingQuantity: 1,
            rate: 165.0,
            amount: 660.0,
            status: "partial",
          },
        ],
        totals: {
          totalItems: 15,
          totalReceived: 14,
          totalPending: 1,
          totalValue: 1160.0,
        },
        status: "partial",
        notes: "One roll of packing tape was damaged during transport",
        createdAt: "2024-06-15T10:30:00Z",
      },
      {
        id: "GRN002",
        grnNumber: "GRN-2024-002",
        reference: "PO-2024-002",
        receiveDate: "2024-06-10",
        purchaseOrder: {
          id: "PO002",
          poNumber: "PO-2024-002",
          supplier: {
            name: "KB Stationery Ltd",
            contact: "Mary Wanjiku",
            email: "sales@kbstationery.co.ke",
            phone: "+254 733 987 654",
          },
        },
        warehouse: { id: 2, name: "Westlands Branch" },
        receivedBy: "Jane Smith",
        items: [
          {
            id: 1,
            productCode: "C0201003",
            productName: "Counter Books KB A4 3 Quire REF 233",
            orderedQuantity: 20,
            receivedQuantity: 20,
            pendingQuantity: 0,
            rate: 320.0,
            amount: 6400.0,
            status: "complete",
          },
        ],
        totals: {
          totalItems: 20,
          totalReceived: 20,
          totalPending: 0,
          totalValue: 6400.0,
        },
        status: "complete",
        notes: "All items received in perfect condition",
        createdAt: "2024-06-10T14:15:00Z",
      },
      {
        id: "GRN003",
        grnNumber: "GRN-2024-003",
        reference: "PO-2024-003",
        receiveDate: "2024-06-05",
        purchaseOrder: {
          id: "PO003",
          poNumber: "PO-2024-003",
          supplier: {
            name: "Office Solutions Kenya",
            contact: "Peter Mwangi",
            email: "orders@officesolutions.co.ke",
            phone: "+254 711 456 789",
          },
        },
        warehouse: { id: 3, name: "Parklands Branch" },
        receivedBy: "Mike Johnson",
        items: [
          {
            id: 1,
            productCode: "P0401001",
            productName: "Petty Cash Voucher White A6 Ref 283",
            orderedQuantity: 50,
            receivedQuantity: 0,
            pendingQuantity: 50,
            rate: 39.0,
            amount: 0.0,
            status: "pending",
          },
        ],
        totals: {
          totalItems: 50,
          totalReceived: 0,
          totalPending: 50,
          totalValue: 0.0,
        },
        status: "pending",
        notes: "Awaiting delivery from supplier",
        createdAt: "2024-06-05T09:45:00Z",
      },
    ]

    setGrns(sampleGRNs)
    setFilteredGrns(sampleGRNs)
  }, [])

  /**
   * Apply search, filter, and sort operations to GRN list
   * This effect runs whenever search term, filter status, or sort configuration changes
   */
  useEffect(() => {
    let filtered = [...grns]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (grn) =>
          grn.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          grn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          grn.purchaseOrder.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          grn.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          grn.receivedBy.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((grn) => grn.status === filterStatus)
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]

        // Handle nested object properties
        if (sortConfig.key.includes(".")) {
          const keys = sortConfig.key.split(".")
          aValue = keys.reduce((obj, key) => obj?.[key], a)
          bValue = keys.reduce((obj, key) => obj?.[key], b)
        }

        // Handle date sorting
        if (sortConfig.key.includes("Date") || sortConfig.key.includes("At")) {
          aValue = new Date(aValue)
          bValue = new Date(bValue)
        }

        // Handle numeric sorting
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
        }

        // Handle string sorting
        const aStr = String(aValue || "").toLowerCase()
        const bStr = String(bValue || "").toLowerCase()

        if (aStr < bStr) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (aStr > bStr) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredGrns(filtered)
  }, [grns, searchTerm, filterStatus, sortConfig])

  /**
   * Handle sorting configuration changes
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
   * Handle tab change in the GRN management interface
   * @param {Event} event - The tab change event
   * @param {number} newValue - The new tab index
   */
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  /**
   * Handle creating a new GRN
   */
  const handleCreateGRN = () => {
    setEditingGrn(null)
    setGrnFormOpen(true)
  }

  /**
   * Handle editing an existing GRN
   * @param {Object} grn - The GRN to edit
   */
  const handleEditGRN = (grn) => {
    setEditingGrn(grn)
    setGrnFormOpen(true)
  }

  /**
   * Handle viewing GRN details
   * @param {Object} grn - The GRN to view
   */
  const handleViewGRN = (grn) => {
    setSelectedGrn(grn)
    setViewDialogOpen(true)
  }

  /**
   * Handle GRN deletion confirmation
   * @param {Object} grn - The GRN to delete
   */
  const handleDeleteGRN = (grn) => {
    setSelectedGrn(grn)
    setDeleteDialogOpen(true)
  }

  /**
   * Confirm GRN deletion
   */
  const confirmDeleteGRN = () => {
    if (selectedGrn) {
      setGrns((prev) => prev.filter((grn) => grn.id !== selectedGrn.id))
      setNotification({
        open: true,
        message: `GRN ${selectedGrn.grnNumber} deleted successfully`,
        severity: "success",
      })
      setDeleteDialogOpen(false)
      setSelectedGrn(null)
    }
  }

  /**
   * Handle GRN form save
   * @param {Object} grnData - The GRN data to save
   */
  const handleSaveGRN = (grnData) => {
    if (editingGrn) {
      // Update existing GRN
      setGrns((prev) =>
        prev.map((grn) =>
          grn.id === editingGrn.id ? { ...grnData, id: editingGrn.id, updatedAt: new Date().toISOString() } : grn,
        ),
      )
      setNotification({
        open: true,
        message: `GRN ${grnData.grnNumber} updated successfully`,
        severity: "success",
      })
    } else {
      // Create new GRN
      const newGRN = {
        ...grnData,
        id: `GRN${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      setGrns((prev) => [newGRN, ...prev])
      setNotification({
        open: true,
        message: `GRN ${grnData.grnNumber} created successfully`,
        severity: "success",
      })
    }
    setGrnFormOpen(false)
    setEditingGrn(null)
  }

  /**
   * Handle notification close
   */
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false })
  }

  /**
   * Format currency values for display
   * @param {number} amount - The amount to format
   * @returns {string} Formatted currency string
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  /**
   * Format date values for display
   * @param {string} dateString - The date string to format
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  /**
   * Get status chip color based on GRN status
   * @param {string} status - The GRN status
   * @returns {string} Material-UI color name
   */
  const getStatusColor = (status) => {
    switch (status) {
      case "complete":
        return "success"
      case "partial":
        return "warning"
      case "pending":
        return "info"
      case "cancelled":
        return "error"
      default:
        return "default"
    }
  }

  /**
   * Calculate summary statistics for the dashboard
   * @returns {Object} Summary statistics
   */
  const calculateSummary = () => {
    const totalGRNs = filteredGrns.length
    const completedGRNs = filteredGrns.filter((grn) => grn.status === "complete").length
    const partialGRNs = filteredGrns.filter((grn) => grn.status === "partial").length
    const pendingGRNs = filteredGrns.filter((grn) => grn.status === "pending").length
    const totalValue = filteredGrns.reduce((sum, grn) => sum + grn.totals.totalValue, 0)

    return {
      totalGRNs,
      completedGRNs,
      partialGRNs,
      pendingGRNs,
      totalValue,
    }
  }

  const summary = calculateSummary()

  return (
    <Box sx={{ width: "100%", bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header Section */}
      <Paper sx={{ mb: 3, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1976d2" }}>
            Goods Received Note Management
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateGRN} sx={{ bgcolor: "#1976d2" }}>
              Create GRN
            </Button>
            <Button variant="outlined" startIcon={<RefreshIcon />}>
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: "#e3f2fd", border: "1px solid #bbdefb" }}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: "#1976d2" }}>
                  {summary.totalGRNs}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total GRNs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: "#e8f5e8", border: "1px solid #c8e6c9" }}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: "#388e3c" }}>
                  {summary.completedGRNs}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: "#fff3e0", border: "1px solid #ffcc02" }}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: "#f57c00" }}>
                  {summary.partialGRNs}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Partial
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: "#e1f5fe", border: "1px solid #b3e5fc" }}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: "#0288d1" }}>
                  {summary.pendingGRNs}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: "#f3e5f5", border: "1px solid #e1bee7" }}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#7b1fa2" }}>
                  {formatCurrency(summary.totalValue)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Value
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filter Controls */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="Search GRNs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
            }}
            sx={{ minWidth: 250 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}>
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="complete">Complete</MenuItem>
              <MenuItem value="partial">Partial</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<SortIcon />} onClick={(e) => setSortMenuAnchor(e.currentTarget)}>
            Sort by Date
            {sortConfig.direction === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </Button>
        </Box>
      </Paper>

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="GRN management tabs"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
            },
          }}
        >
          <Tab label="All GRNs" />
          <Tab label="Pending Receipts" />
          <Tab label="Completed Receipts" />
          <Tab label="Reports" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {/* All GRNs Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 600 }}>GRN Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reference</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Receive Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Warehouse</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total Value</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGrns.map((grn) => (
                  <TableRow key={grn.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {grn.grnNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{grn.reference}</TableCell>
                    <TableCell>{grn.purchaseOrder.supplier.name}</TableCell>
                    <TableCell>{formatDate(grn.receiveDate)}</TableCell>
                    <TableCell>{grn.warehouse.name}</TableCell>
                    <TableCell>{formatCurrency(grn.totals.totalValue)}</TableCell>
                    <TableCell>
                      <Chip label={grn.status.toUpperCase()} color={getStatusColor(grn.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewGRN(grn)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit GRN">
                          <IconButton size="small" onClick={() => handleEditGRN(grn)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Print GRN">
                          <IconButton size="small">
                            <PrintIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete GRN">
                          <IconButton size="small" onClick={() => handleDeleteGRN(grn)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Pending Receipts */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Pending Goods Receipts
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#fff3e0" }}>
                  <TableCell sx={{ fontWeight: 600 }}>GRN Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Purchase Order</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Expected Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Pending Items</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGrns
                  .filter((grn) => grn.status === "pending" || grn.status === "partial")
                  .map((grn) => (
                    <TableRow key={grn.id} hover>
                      <TableCell>{grn.grnNumber}</TableCell>
                      <TableCell>{grn.reference}</TableCell>
                      <TableCell>{grn.purchaseOrder.supplier.name}</TableCell>
                      <TableCell>{formatDate(grn.receiveDate)}</TableCell>
                      <TableCell>
                        <Chip label={`${grn.totals.totalPending} items`} color="warning" size="small" />
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="contained" onClick={() => handleEditGRN(grn)}>
                          Process Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Completed Receipts */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Completed Goods Receipts
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#e8f5e8" }}>
                  <TableCell sx={{ fontWeight: 600 }}>GRN Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Purchase Order</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Completed Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total Value</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGrns
                  .filter((grn) => grn.status === "complete")
                  .map((grn) => (
                    <TableRow key={grn.id} hover>
                      <TableCell>{grn.grnNumber}</TableCell>
                      <TableCell>{grn.reference}</TableCell>
                      <TableCell>{grn.purchaseOrder.supplier.name}</TableCell>
                      <TableCell>{formatDate(grn.receiveDate)}</TableCell>
                      <TableCell>{formatCurrency(grn.totals.totalValue)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button size="small" startIcon={<ViewIcon />} onClick={() => handleViewGRN(grn)}>
                            View
                          </Button>
                          <Button size="small" startIcon={<PrintIcon />}>
                            Print
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {/* Reports */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            GRN Reports & Analytics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Monthly Summary
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Generate monthly GRN reports with detailed analytics
                  </Typography>
                  <Button variant="contained" sx={{ mt: 2 }} startIcon={<DownloadIcon />}>
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Supplier Performance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Analyze supplier delivery performance and quality metrics
                  </Typography>
                  <Button variant="contained" sx={{ mt: 2 }} startIcon={<DownloadIcon />}>
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </TabPanel>

      {/* Sort Menu */}
      <Menu anchorEl={sortMenuAnchor} open={Boolean(sortMenuAnchor)} onClose={() => setSortMenuAnchor(null)}>
        <MenuItem onClick={() => handleSort("receiveDate")}>
          Receive Date {sortConfig.key === "receiveDate" && (sortConfig.direction === "asc" ? "↑" : "↓")}
        </MenuItem>
        <MenuItem onClick={() => handleSort("createdAt")}>
          Created Date {sortConfig.key === "createdAt" && (sortConfig.direction === "asc" ? "↑" : "↓")}
        </MenuItem>
        <MenuItem onClick={() => handleSort("grnNumber")}>
          GRN Number {sortConfig.key === "grnNumber" && (sortConfig.direction === "asc" ? "↑" : "↓")}
        </MenuItem>
        <MenuItem onClick={() => handleSort("totals.totalValue")}>
          Total Value {sortConfig.key === "totals.totalValue" && (sortConfig.direction === "asc" ? "↑" : "↓")}
        </MenuItem>
      </Menu>

      {/* GRN Form Dialog */}
      <GoodsReceivedNoteForm
        open={grnFormOpen}
        onClose={() => {
          setGrnFormOpen(false)
          setEditingGrn(null)
        }}
        onSave={handleSaveGRN}
        editGRN={editingGrn}
      />

      {/* View GRN Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">GRN Details</Typography>
            <Button variant="outlined" startIcon={<PrintIcon />}>
              Print
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedGrn && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: "#1976d2" }}>
                      GRN Information
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>GRN Number:</strong> {selectedGrn.grnNumber}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Reference:</strong> {selectedGrn.reference}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Receive Date:</strong> {formatDate(selectedGrn.receiveDate)}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Warehouse:</strong> {selectedGrn.warehouse.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Received By:</strong> {selectedGrn.receivedBy}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Status:</strong>{" "}
                      <Chip
                        label={selectedGrn.status.toUpperCase()}
                        color={getStatusColor(selectedGrn.status)}
                        size="small"
                      />
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: "#1976d2" }}>
                      Supplier Information
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Name:</strong> {selectedGrn.purchaseOrder.supplier.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Contact:</strong> {selectedGrn.purchaseOrder.supplier.contact}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Email:</strong> {selectedGrn.purchaseOrder.supplier.email}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Phone:</strong> {selectedGrn.purchaseOrder.supplier.phone}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Paper sx={{ mt: 3, p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: "#1976d2" }}>
                  Received Items
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                        <TableCell>Product Code</TableCell>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Ordered</TableCell>
                        <TableCell>Received</TableCell>
                        <TableCell>Pending</TableCell>
                        <TableCell>Rate</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedGrn.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.productCode}</TableCell>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>{item.orderedQuantity}</TableCell>
                          <TableCell>{item.receivedQuantity}</TableCell>
                          <TableCell>{item.pendingQuantity}</TableCell>
                          <TableCell>{formatCurrency(item.rate)}</TableCell>
                          <TableCell>{formatCurrency(item.amount)}</TableCell>
                          <TableCell>
                            <Chip label={item.status} color={getStatusColor(item.status)} size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              <Paper sx={{ mt: 3, p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: "#1976d2" }}>
                  Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Total Items:</strong> {selectedGrn.totals.totalItems}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Total Received:</strong> {selectedGrn.totals.totalReceived}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Total Pending:</strong> {selectedGrn.totals.totalPending}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Total Value:</strong> {formatCurrency(selectedGrn.totals.totalValue)}
                    </Typography>
                  </Grid>
                </Grid>
                {selectedGrn.notes && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Notes:</strong> {selectedGrn.notes}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => {
              setViewDialogOpen(false)
              handleEditGRN(selectedGrn)
            }}
          >
            Edit GRN
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete GRN {selectedGrn?.grnNumber}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDeleteGRN}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
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
    </Box>
  )
}

export default GRNManagement
