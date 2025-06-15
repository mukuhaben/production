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
  Tabs,
  Tab,
  Avatar,
  Tooltip,
} from "@mui/material"
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon, // Re-using for address/general location
  Person as PersonIcon, // For customer avatar
  Search as SearchIcon,
  Close as CloseIcon,
  CreditCard as CreditCardIcon, // For Transactions
  MonetizationOn as MonetizationOnIcon, // For Cashbacks
  Block as BlockIcon, // For Block action
  CheckCircleOutline as UnblockIcon, // For Unblock action
  DeleteForever as DeleteForeverIcon, // For permanent delete
  WarningAmber as WarningIcon,
} from "@mui/icons-material"
import { Alert as MuiAlert } from "@mui/material" // Renamed to avoid conflict with alertInfo state
import CircularProgress from "@mui/material/CircularProgress"; // for loading states


// API service (consider moving to a dedicated services/api.js or customerService.js)
// For now, placeholder functions. Replace with actual API calls.
const apiClient = {
  get: async (url) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    const response = await fetch(`/api${url}`, { // Prepending /api, adjust if your proxy is different
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  },
  post: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const token = localStorage.getItem("token");
    const response = await fetch(`/api${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  },
  patch: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const token = localStorage.getItem("token");
    const response = await fetch(`/api${url}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
     if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  },
  delete: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const token = localStorage.getItem("token");
    const response = await fetch(`/api${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  },
};


// TabPanel Component for customer details tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customer-tabpanel-${index}`}
      aria-labelledby={`customer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null) // For view/edit/delete details
  const [detailedCustomerData, setDetailedCustomerData] = useState(null); // For view dialog
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [customerFormData, setCustomerFormData] = useState({
    id: null, // For editing
    firstName: "", // Changed from name
    lastName: "",  // Added
    username: "", // Added, usually email or unique identifier
    email: "",
    phone: "",
    // address: "", // Address might be more complex, handle later if needed via user_addresses table
    password: "", // For new customer
    userType: "customer", // Default
    isActive: true, // Default
  })
  const [isAdd, setIsAdd] = useState(false)
  const [alertInfo, setAlertInfo] = useState({ open: false, message: "", severity: "success" })

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsTabValue, setDetailsTabValue] = useState(0)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);


  const fetchCustomers = async () => {
    setIsLoading(true)
    setAlertInfo({ open: false, message: "" });
    try {
      // Use userType=customer to fetch only customers
      const response = await apiClient.get("/users?userType=customer&limit=100&sortBy=created_at&sortOrder=DESC")
      if (response.success && response.data && Array.isArray(response.data.users)) {
        setCustomers(response.data.users)
      } else {
        setCustomers([])
        setAlertInfo({ open: true, message: response.message || "Failed to fetch customers.", severity: "error" });
      }
    } catch (error) {
      console.error("Fetch customers error:", error)
      setCustomers([])
      setAlertInfo({ open: true, message: error.message || "An error occurred while fetching customers.", severity: "error" });
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredCustomers = customers.filter((customer) => {
    const name = `${customer.first_name || ""} ${customer.last_name || ""}`.toLowerCase()
    const email = (customer.email || "").toLowerCase()
    const phone = (customer.phone || "").toLowerCase()
    const searchTermLower = searchTerm.toLowerCase()
    return name.includes(searchTermLower) || email.includes(searchTermLower) || phone.includes(searchTermLower)
  })

  const handleFormInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setCustomerFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setCustomerFormData({
      id: null,
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      userType: "customer",
      isActive: true,
    })
  }

  const handleAddCustomerDialogOpen = () => {
    setIsAdd(true)
    resetForm()
    setOpenDialog(true)
  }

  // No separate edit dialog for now, edit will be inline or a separate feature.
  // For this task, we focus on Add, Block/Unblock, Remove, View.

  const handleAddOrUpdateCustomer = async (event) => {
    event.preventDefault();
    setAlertInfo({ open: false, message: "" });
    const { id, firstName, lastName, username, email, phone, password, isActive } = customerFormData;

    if (!firstName || !lastName || !username || !email) {
      setAlertInfo({ open: true, message: "First Name, Last Name, Username, and Email are required.", severity: "error" });
      return;
    }
    if (isAdd && !password) {
       setAlertInfo({ open: true, message: "Password is required for new customers.", severity: "error" });
      return;
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      phone,
      user_type: "customer",
      is_active: isActive,
      // For simplicity, not handling address or other fields from schema yet
    };
    if (isAdd) {
      payload.password = password;
    }

    // const endpoint = isAdd ? '/users/register' : `/users/${id}`; // Assuming PUT for update on /users/:id
    // const method = isAdd ? 'post' : 'put';
    // For this task, only implementing ADD. Update of user details is more complex.
    // The backend for /users/register is in authController, not users.js directly for creation.
    // Using a placeholder /api/users for POST for now.

    try {
      if (isAdd) { // Only handling add for now
        const response = await apiClient.post("/users/register-customer", payload); // Target new specific endpoint
        if (response.success) {
          setAlertInfo({ open: true, message: "Customer added successfully!", severity: "success" });
          fetchCustomers(); // Refresh list
          handleCloseDialog();
        } else {
          setAlertInfo({ open: true, message: response.message || "Failed to add customer.", severity: "error" });
        }
      } else {
         // Update logic would go here, e.g. apiClient.put(`/users/${id}`, payload)
         setAlertInfo({ open: true, message: "Update functionality not fully implemented in this step.", severity: "info" });
         // For now, just close dialog on "edit" attempt
         handleCloseDialog();
      }
    } catch (error) {
      console.error("Add/Update customer error:", error);
      setAlertInfo({ open: true, message: error.message || "An error occurred.", severity: "error" });
    }
  };


  const handleViewCustomerDetails = async (customer) => {
    setSelectedCustomer(customer); // Keep basic info for dialog title
    setDetailsOpen(true);
    setDetailsTabValue(0);
    setIsDetailLoading(true);
    setDetailedCustomerData(null); // Clear previous detailed data
    setAlertInfo({ open: false, message: "" });

    try {
      const response = await apiClient.get(`/users/${customer.id}`);
      if (response.success) {
        setDetailedCustomerData(response.data.user);
      } else {
        setAlertInfo({ open: true, message: response.message || "Failed to fetch customer details.", severity: "error" });
      }
    } catch (error) {
      console.error("Fetch customer details error:", error);
      setAlertInfo({ open: true, message: error.message || "An error occurred fetching details.", severity: "error" });
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedCustomer(null) // Clear selected customer when closing add/edit dialog
    resetForm()
  }

  const handleOpenConfirmDeleteDialog = (customer) => {
    setCustomerToDelete(customer);
    setConfirmDeleteOpen(true);
  };

  const handleCloseConfirmDeleteDialog = () => {
    setCustomerToDelete(null);
    setConfirmDeleteOpen(false);
  };

  const handleConfirmDeleteCustomer = async () => {
    if (!customerToDelete) return;
    setAlertInfo({ open: false, message: "" });
    try {
      // The users.js route for DELETE is /:id/deactivate which is a PATCH, not DELETE
      // For a true delete, this would be `apiClient.delete(`/users/${customerToDelete.id}`)`
      // Using deactivate for now as it exists.
      const response = await apiClient.patch(`/users/${customerToDelete.id}/deactivate`, { reason: "Deactivated by admin from Customer Management" });
      if (response.success) {
        setAlertInfo({ open: true, message: `Customer ${customerToDelete.first_name} deactivated successfully.`, severity: "success" });
        fetchCustomers(); // Refresh list
      } else {
        setAlertInfo({ open: true, message: response.message || "Failed to deactivate customer.", severity: "error" });
      }
    } catch (error) {
      console.error("Deactivate customer error:", error);
      setAlertInfo({ open: true, message: error.message || "An error occurred.", severity: "error" });
    } finally {
      handleCloseConfirmDeleteDialog();
    }
  };

  const handleToggleBlockCustomer = async (customer) => {
    setAlertInfo({ open: false, message: "" });
    const newStatus = !customer.is_active;
    const action = newStatus ? "reactivate" : "deactivate";
    const actionPastTense = newStatus ? "reactivated" : "deactivated";

    try {
      const response = await apiClient.patch(`/users/${customer.id}/${action}`, { reason: `${actionPastTense} by admin` });
      if (response.success) {
        setAlertInfo({ open: true, message: `Customer ${actionPastTense} successfully.`, severity: "success" });
        fetchCustomers(); // Refresh list
      } else {
        setAlertInfo({ open: true, message: response.message || `Failed to ${action} customer.`, severity: "error" });
      }
    } catch (error) {
      console.error(`Toggle block customer error (${action}):`, error);
      setAlertInfo({ open: true, message: error.message || "An error occurred.", severity: "error" });
    }
  };


  const getStatusChipColor = (isActive) => { // Changed from status string to boolean isActive
    if (isActive) return "success"
    return "default" // For inactive/blocked
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount || 0)
  }


  return (
    <Box sx={{ width: "100%", bgcolor: "#f8fafc", minHeight: "100vh", p:3 }}>
      <Paper sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ p: 3, bgcolor: "#1976d2", color: "white" }}>
          <Typography variant="h5" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            Customer Management
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
            View and manage customer information, transactions, and cashbacks.
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ mb: 3, p: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif" }}>
            Customer List
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCustomerDialogOpen} // Changed
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Add Customer
          </Button>
        </Box>

        <TextField
          fullWidth
          placeholder="Search customers by name, email, or phone..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} /> }}
          size="small"
          sx={{ mb: 2 }}
        />

        {alertInfo.open && (
          <MuiAlert severity={alertInfo.severity} onClose={() => setAlertInfo({ ...alertInfo, open: false })} sx={{ mb: 2 }}>
            {alertInfo.message}
          </MuiAlert>
        )}
        {isLoading && <Box sx={{display: 'flex', justifyContent: 'center', my: 3}}><CircularProgress /></Box>}

        {!isLoading && <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Joined Date</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "#1976d2" }}><PersonIcon /></Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {customer.first_name} {customer.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">ID: {customer.id.substring(0,8)}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{customer.email}</Typography>
                    <Typography variant="body2" color="text.secondary">{customer.phone || "N/A"}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={customer.is_active ? "Active" : "Inactive"}
                      color={getStatusChipColor(customer.is_active)}
                      size="small"
                    />
                  </TableCell>
                   <TableCell>
                    <Typography variant="body2">{new Date(customer.created_at).toLocaleDateString()}</Typography>
                  </TableCell>
                  <TableCell sx={{textAlign: 'center'}}>
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleViewCustomerDetails(customer)}><ViewIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title={customer.is_active ? "Block Customer" : "Unblock Customer"}>
                      <IconButton size="small" onClick={() => handleToggleBlockCustomer(customer)}>
                        {customer.is_active ? <BlockIcon /> : <UnblockIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Deactivate Customer">
                      <IconButton size="small" color="error" onClick={() => handleOpenConfirmDeleteDialog(customer)}><DeleteForeverIcon /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCustomers.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary">No customers found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
}
      </Paper>

      {/* Add Customer Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">{isAdd ? "Add New Customer" : "Edit Customer (Not Implemented)"}</Typography>
            <IconButton onClick={handleCloseDialog}><CloseIcon /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleAddOrUpdateCustomer} sx={{ mt: 2 }}>
            <TextField name="firstName" label="First Name" value={customerFormData.firstName} onChange={handleFormInputChange} required sx={{ mb: 2 }} fullWidth/>
            <TextField name="lastName" label="Last Name" value={customerFormData.lastName} onChange={handleFormInputChange} required sx={{ mb: 2 }} fullWidth/>
            <TextField name="username" label="Username" value={customerFormData.username} onChange={handleFormInputChange} required sx={{ mb: 2 }} fullWidth helperText="Usually same as email or a unique ID"/>
            <TextField name="email" label="Email Address" type="email" value={customerFormData.email} onChange={handleFormInputChange} required sx={{ mb: 2 }} fullWidth/>
            <TextField name="phone" label="Phone Number" value={customerFormData.phone} onChange={handleFormInputChange} sx={{ mb: 2 }} fullWidth/>
            {isAdd && <TextField name="password" label="Password" type="password" value={customerFormData.password} onChange={handleFormInputChange} required sx={{ mb: 2 }} fullWidth/>}
            <TextField name="isActive" select label="Status" value={customerFormData.isActive} onChange={(e) => setCustomerFormData(prev => ({...prev, isActive: e.target.value === 'true'}))} fullWidth sx={{ mb: 2 }}>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddOrUpdateCustomer} variant="contained" disabled={!isAdd}> {/* Only Add enabled for now */}
            {isAdd ? "Add Customer" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={handleCloseConfirmDeleteDialog} maxWidth="xs">
        <DialogTitle>Confirm Deactivation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to deactivate customer: {customerToDelete?.first_name} {customerToDelete?.last_name}?</Typography>
          <Typography variant="caption">This action will mark the customer as inactive.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDeleteCustomer} color="error">Deactivate</Button>
        </DialogActions>
      </Dialog>

      {/* Customer Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">{selectedCustomer?.first_name} {selectedCustomer?.last_name} - Customer Details</Typography>
            <IconButton onClick={() => setDetailsOpen(false)}><CloseIcon /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {isDetailLoading && <Box sx={{display: 'flex', justifyContent: 'center', my:5}}><CircularProgress /></Box>}
          {!isDetailLoading && !detailedCustomerData && <Typography>No details available for this customer.</Typography>}
          {!isDetailLoading && detailedCustomerData && (
            <Box>
              <Paper sx={{ p: 2, mb: 2, bgcolor: "#f8f9fa" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3} sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ width: 80, height: 80, mx: "auto", mb: 1, bgcolor: "#1976d2" }}><PersonIcon sx={{ fontSize: 40 }} /></Avatar>
                    <Typography variant="h6">{detailedCustomerData.first_name} {detailedCustomerData.last_name}</Typography>
                    <Chip label={detailedCustomerData.is_active ? "Active" : "Inactive"} color={getStatusChipColor(detailedCustomerData.is_active)} size="small" />
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Typography variant="subtitle1" gutterBottom><strong>Username:</strong> {detailedCustomerData.username}</Typography>
                    <Typography variant="subtitle1" gutterBottom><strong>Email:</strong> {detailedCustomerData.email}</Typography>
                    <Typography variant="subtitle1" gutterBottom><strong>Phone:</strong> {detailedCustomerData.phone || "N/A"}</Typography>
                    <Typography variant="subtitle1" gutterBottom><strong>Joined:</strong> {new Date(detailedCustomerData.created_at).toLocaleDateString()}</Typography>
                    <Typography variant="subtitle1" gutterBottom><strong>Total Orders:</strong> {detailedCustomerData.orderStats?.total_orders || 0}</Typography>
                    <Typography variant="subtitle1" gutterBottom><strong>Total Spent:</strong> {formatCurrency(detailedCustomerData.orderStats?.total_spent)}</Typography>
                    <Typography variant="subtitle1"><strong>Cashback Balance:</strong> {formatCurrency(detailedCustomerData.walletBalance)}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Tabs value={detailsTabValue} onChange={(event, newValue) => setDetailsTabValue(newValue)} aria-label="customer details tabs">
                <Tab label="Overview" icon={<PersonIcon />} iconPosition="start" />
                <Tab label="Transactions" icon={<CreditCardIcon />} iconPosition="start" />
                <Tab label="Cashbacks" icon={<MonetizationOnIcon />} iconPosition="start" />
              </Tabs>

              <TabPanel value={detailsTabValue} index={0}>
                <Typography variant="h6" sx={{ mb: 2 }}>Customer Overview</Typography>
                <Typography>Detailed overview of customer activity, preferences, and additional metrics will be displayed here.</Typography>
                {/* Additional details like KRA PIN, Company Name if available */}
                {detailedCustomerData.company_name && <Typography><strong>Company:</strong> {detailedCustomerData.company_name}</Typography>}
                {detailedCustomerData.kra_pin && <Typography><strong>KRA PIN:</strong> {detailedCustomerData.kra_pin}</Typography>}
              </TabPanel>

              <TabPanel value={detailsTabValue} index={1}>
                <Typography variant="h6" sx={{ mb: 2 }}>Recent Transactions (Orders)</Typography>
                {detailedCustomerData.recentOrders && detailedCustomerData.recentOrders.length > 0 ? (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Order #</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Payment Status</TableCell>
                          <TableCell>Cashback</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detailedCustomerData.recentOrders.map(order => (
                          <TableRow key={order.id}>
                            <TableCell>{order.order_number}</TableCell>
                            <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                            <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                            <TableCell><Chip label={order.status} size="small" /></TableCell>
                            <TableCell><Chip label={order.payment_status} size="small" /></TableCell>
                            <TableCell>{formatCurrency(order.cashback_amount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : <Typography>No recent transactions to display.</Typography>}
              </TabPanel>

              <TabPanel value={detailsTabValue} index={2}>
                <Typography variant="h6" sx={{ mb: 2 }}>Recent Cashback Activity</Typography>
                {detailedCustomerData.recentCashbackTransactions && detailedCustomerData.recentCashbackTransactions.length > 0 ? (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Balance After</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detailedCustomerData.recentCashbackTransactions.map(cb => (
                          <TableRow key={cb.id}>
                            <TableCell>{new Date(cb.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{cb.transaction_type}</TableCell>
                            <TableCell>{cb.description || cb.reference_type || 'N/A'}</TableCell>
                            <TableCell sx={{color: cb.amount > 0 ? 'green' : 'red'}}>{formatCurrency(cb.amount)}</TableCell>
                            <TableCell>{formatCurrency(cb.balance_after)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : <Typography>No cashback history to display.</Typography>}
              </TabPanel>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CustomerManagement;
