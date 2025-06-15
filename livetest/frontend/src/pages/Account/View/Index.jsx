import React, { useState, useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Badge,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material"
import {
  Person,
  Edit,
  ShoppingBag,
  Inbox,
  Settings,
  PhotoCamera,
  Notifications,
  CheckCircle,
  Schedule,
  Delete,
  DeleteForever,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

// Import sample product images
import softChairsImage from "../../../assets/images/1.png"
import sofaChairImage from "../../../assets/images/2.png"
import kitchenDishesImage from "../../../assets/images/11.png"
import smartWatchesImage from "../../../assets/images/8.png"

// Mock data for orders - will be sorted by date
const mockOrdersData = [
  {
    orderNo: "ORD-2023-001",
    date: "2023-05-15",
    image: softChairsImage,
    productName: "Soft Chair",
    itemCode: "SC001",
    totalPaid: 80,
    cashbackPercent: 5,
    cashbackAmount: 4,
    status: "Completed",
    etimsInvNo: "INV-2023-001",
  },
  {
    orderNo: "ORD-2023-002",
    date: "2023-06-02",
    image: sofaChairImage,
    productName: "Sofa Chair",
    itemCode: "SC002",
    totalPaid: 150,
    cashbackPercent: 3,
    cashbackAmount: 5,
    status: "Pending",
    etimsInvNo: null,
  },
  {
    orderNo: "ORD-2023-003",
    date: "2023-06-10",
    image: kitchenDishesImage,
    productName: "Kitchen Dishes Set",
    itemCode: "KD001",
    totalPaid: 60,
    cashbackPercent: 7,
    cashbackAmount: 4,
    status: "Completed",
    etimsInvNo: "INV-2023-002",
  },
  {
    orderNo: "ORD-2023-004",
    date: "2023-06-18",
    image: smartWatchesImage,
    productName: "Smart Watch",
    itemCode: "SW001",
    totalPaid: 130,
    cashbackPercent: 10,
    cashbackAmount: 13,
    status: "Pending",
    etimsInvNo: null,
  },
]

// Sort orders by date (newest first) and assign serial numbers
const mockOrders = [...mockOrdersData]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .map((order, index) => ({
    ...order,
    serialNo: index + 1,
  }))

// Mock data for inbox messages
const mockMessages = [
  {
    id: 1,
    type: "order",
    title: "Order Confirmation",
    message: "Your order #ORD-2023-001 has been confirmed and is being processed.",
    date: "2023-05-15",
    read: true,
  },
  {
    id: 2,
    type: "support",
    title: "Support Ticket #ST-001",
    message: "Your support ticket regarding product return has been received. Our team will contact you shortly.",
    date: "2023-06-05",
    read: false,
  },
  {
    id: 3,
    type: "order",
    title: "Order Shipped",
    message: "Your order #ORD-2023-003 has been shipped. Expected delivery in 3-5 business days.",
    date: "2023-06-12",
    read: false,
  },
  {
    id: 4,
    type: "promotion",
    title: "Special Offer",
    message: "Enjoy 20% off on all kitchen appliances this weekend. Use code: KITCHEN20",
    date: "2023-06-20",
    read: true,
  },
]

const AccountPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const navigate = useNavigate()

  // State for active tab
  const [activeTab, setActiveTab] = useState(0)

  // State for user data
  const [userData, setUserData] = useState({
    username: "John Doe",
    email: "john.doe@example.com",
    phone: "+254 722 123 456",
    address: "123 Main St, Nairobi, Kenya",
    profilePicture: null,
  })

  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // State for edit mode
  const [editMode, setEditMode] = useState(false)

  // State for profile picture dialog
  const [profilePictureDialog, setProfilePictureDialog] = useState(false)

  // State for remove profile picture confirmation dialog
  const [removeProfileDialog, setRemoveProfileDialog] = useState(false)

  // State for unread messages count
  const [unreadCount, setUnreadCount] = useState(0)

  // State for success message
  const [successMessage, setSuccessMessage] = useState("")

  // Calculate unread messages count
  useEffect(() => {
    const count = mockMessages.filter((message) => !message.read).length
    setUnreadCount(count)
  }, [])

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Handle user data change
  const handleUserDataChange = (e) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value,
    })
  }

  // Handle password data change
  const handlePasswordDataChange = (e) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value,
    })
  }

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUserData({
          ...userData,
          profilePicture: e.target.result,
        })
        setProfilePictureDialog(false)
        setSuccessMessage("Profile picture updated successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  // Handle remove profile picture
  const handleRemoveProfilePicture = () => {
    setUserData({
      ...userData,
      profilePicture: null,
    })
    setRemoveProfileDialog(false)
    setSuccessMessage("Profile picture removed successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  // Handle save profile
  const handleSaveProfile = () => {
    // In a real app, you would send the updated data to the server
    setEditMode(false)
    setSuccessMessage("Profile updated successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  // Handle password change
  const handlePasswordChange = () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!")
      return
    }

    // In a real app, you would send the password change request to the server
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setSuccessMessage("Password changed successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  // Handle message read
  const handleMessageRead = (id) => {
    // Mark message as read
    const updatedMessages = mockMessages.map((message) => (message.id === id ? { ...message, read: true } : message))
    // In a real app, you would update this in the server/state management
    setUnreadCount(updatedMessages.filter((message) => !message.read).length)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Paper elevation={1} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            src={userData.profilePicture}
            sx={{ width: 80, height: 80, mr: 2, bgcolor: theme.palette.primary.main }}
          >
            {!userData.profilePicture && <Person fontSize="large" />}
          </Avatar>
          <Box>
            <Typography variant="h5" component="h1" gutterBottom>
              Hello, {userData.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome to your account dashboard
            </Typography>
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile
            aria-label="account tabs"
          >
            <Tab icon={<Person />} label="Profile" iconPosition="start" sx={{ minHeight: 48, textTransform: "none" }} />
            <Tab
              icon={<ShoppingBag />}
              label="My Orders"
              iconPosition="start"
              sx={{ minHeight: 48, textTransform: "none" }}
            />
            <Tab
              icon={
                <Badge badgeContent={unreadCount} color="error">
                  <Inbox />
                </Badge>
              }
              label="Inbox"
              iconPosition="start"
              sx={{ minHeight: 48, textTransform: "none" }}
            />
            <Tab
              icon={<Settings />}
              label="Settings"
              iconPosition="start"
              sx={{ minHeight: 48, textTransform: "none" }}
            />
          </Tabs>
        </Box>

        {/* Profile Tab */}
        {activeTab === 0 && (
          <Box sx={{ py: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" component="h2">
                Account Information
              </Typography>
              <Button
                variant="outlined"
                startIcon={editMode ? null : <Edit />}
                onClick={() => setEditMode(!editMode)}
                color={editMode ? "success" : "primary"}
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3, position: "relative", textAlign: "center" }}>
                  <Avatar
                    src={userData.profilePicture}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: "auto",
                      mb: 2,
                      bgcolor: theme.palette.primary.main,
                    }}
                  >
                    {!userData.profilePicture && <Person fontSize="large" />}
                  </Avatar>

                  {/* Profile picture actions */}
                  {editMode && (
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PhotoCamera />}
                        onClick={() => setProfilePictureDialog(true)}
                        size="small"
                      >
                        Change Photo
                      </Button>

                      {userData.profilePicture && (
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteForever />}
                          onClick={() => setRemoveProfileDialog(true)}
                          size="small"
                        >
                          Remove
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>

                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={userData.username}
                  onChange={handleUserDataChange}
                  disabled={!editMode}
                  margin="normal"
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleUserDataChange}
                  disabled={!editMode}
                  margin="normal"
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleUserDataChange}
                  disabled={!editMode}
                  margin="normal"
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={userData.address}
                  onChange={handleUserDataChange}
                  disabled={!editMode}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={3}
                />

                {editMode && (
                  <Button variant="contained" color="primary" onClick={handleSaveProfile} sx={{ mt: 2 }} fullWidth>
                    Save Changes
                  </Button>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Change Password
                </Typography>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordDataChange}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordDataChange}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordDataChange}
                  margin="normal"
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePasswordChange}
                  sx={{ mt: 2 }}
                  fullWidth
                  disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                >
                  Update Password
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Orders Tab */}
        {activeTab === 1 && (
          <Box sx={{ py: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              My Orders
            </Typography>
            {mockOrders.length > 0 ? (
              <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                      <TableCell>Serial No.</TableCell>
                      <TableCell>Order No.</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Total Paid</TableCell>
                      <TableCell align="center">Cashback</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">ETIMS INV NO.</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockOrders.map((order, index) => {
                      return (
                        <TableRow key={order.serialNo} hover>
                          <TableCell>{order.serialNo}</TableCell>
                          <TableCell>
                            <Button
                              variant="text"
                              color="primary"
                              onClick={() => navigate(`/order-details/${order.orderNo}`)}
                              sx={{ textTransform: "none", padding: 0, minWidth: "auto" }}
                            >
                              {order.orderNo}
                            </Button>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell align="right">{order.totalPaid}/=</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`${order.cashbackAmount}/=`}
                              color="success"
                              size="small"
                              sx={{ fontSize: "0.7rem", height: "20px" }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={order.status}
                              color={order.status === "Completed" ? "success" : "warning"}
                              size="small"
                              icon={order.status === "Completed" ? <CheckCircle /> : <Schedule />}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {order.etimsInvNo || (
                              <Chip
                                label="Pending"
                                size="small"
                                color="default"
                                sx={{ fontSize: "0.7rem", height: "20px" }}
                              />
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(`/order-details/${order.orderNo}`)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <ShoppingBag sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Orders Yet
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate("/")} sx={{ mt: 2 }}>
                  Browse Products
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* Inbox Tab */}
        {activeTab === 2 && (
          <Box sx={{ py: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" component="h2">
                My Inbox
              </Typography>
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            </Box>

            {mockMessages.length > 0 ? (
              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {mockMessages.map((message) => (
                  <React.Fragment key={message.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        bgcolor: message.read ? "transparent" : "rgba(25, 118, 210, 0.08)",
                        borderRadius: 1,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor:
                              message.type === "order"
                                ? "primary.main"
                                : message.type === "support"
                                  ? "secondary.main"
                                  : "success.main",
                          }}
                        >
                          {message.type === "order" ? (
                            <ShoppingBag />
                          ) : message.type === "support" ? (
                            <Inbox />
                          ) : (
                            <Notifications />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography
                              variant="subtitle1"
                              component="span"
                              sx={{ fontWeight: message.read ? "normal" : "bold" }}
                            >
                              {message.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {message.date}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              sx={{ display: "block", mt: 1 }}
                            >
                              {message.message}
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                              {!message.read && (
                                <Button size="small" onClick={() => handleMessageRead(message.id)} sx={{ mr: 1 }}>
                                  Mark as Read
                                </Button>
                              )}
                              <Button size="small" variant="outlined">
                                View Details
                              </Button>
                            </Box>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" sx={{ my: 1 }} />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Inbox sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Your Inbox is Empty
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You don't have any messages yet. Notifications about your orders and support tickets will appear here.
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Settings Tab */}
        {activeTab === 3 && (
          <Box sx={{ py: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Account Settings
            </Typography>

            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Notification Preferences
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body1">Email Notifications</Typography>
                      <Button variant="outlined" size="small">
                        Manage
                      </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Receive notifications about orders, promotions, and account updates via email.
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Privacy Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body1">Data Sharing</Typography>
                      <Button variant="outlined" size="small">
                        Manage
                      </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Control how your data is used and shared with third parties.
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="error">
                  Danger Zone
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="body1">Delete Account</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Permanently delete your account and all associated data.
                    </Typography>
                  </Box>
                  <Button variant="outlined" color="error" startIcon={<Delete />}>
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Paper>

      {/* Profile Picture Upload Dialog */}
      <Dialog open={profilePictureDialog} onClose={() => setProfilePictureDialog(false)}>
        <DialogTitle>Change Profile Picture</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Upload a new profile picture. The image should be at least 200x200 pixels.
          </Typography>
          <Button variant="contained" component="label" startIcon={<PhotoCamera />} fullWidth>
            Choose File
            <input type="file" hidden accept="image/*" onChange={handleProfilePictureChange} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfilePictureDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Remove Profile Picture Confirmation Dialog */}
      <Dialog open={removeProfileDialog} onClose={() => setRemoveProfileDialog(false)}>
        <DialogTitle>Remove Profile Picture</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to remove your profile picture?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveProfileDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleRemoveProfilePicture}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AccountPage
