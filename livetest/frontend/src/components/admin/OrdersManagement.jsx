import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import { Visibility as ViewIcon } from "@mui/icons-material";
import { ordersAPI } from "../../../services/api"; // Adjust path as necessary

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await ordersAPI.getAll({}); // Fetch all orders
        if (response.data && response.data.success) {
          // Assuming the backend returns orders in response.data.data.orders or response.data.orders
          const fetchedOrders = response.data.data?.orders || response.data?.orders || [];
          setOrders(fetchedOrders);
        } else {
          setError(response.data?.message || "Failed to fetch orders.");
          setOrders([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "An error occurred while fetching orders.");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusChipColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getPaymentStatusChipColor = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
        All Customer Orders
      </Typography>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {!isLoading && !error && (
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Order Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">Total Amount</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">Order Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">Payment Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="textSecondary">No orders found.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {orders.map((order) => (
                <TableRow hover key={order.id || order.order_number}>
                  <TableCell>{order.order_number || order.id}</TableCell>
                  <TableCell>
                    {/* Placeholder for customer name - display user_id or name if available */}
                    {order.user ? `${order.user.first_name || ''} ${order.user.last_name || ''}`.trim() || `ID: ${order.user_id}` : `ID: ${order.user_id || 'N/A'}`}
                  </TableCell>
                  <TableCell>{formatDate(order.order_date)}</TableCell>
                  <TableCell align="right">
                    {new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(order.total_amount || 0)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={order.status || "N/A"}
                      color={getStatusChipColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={order.payment_status || "N/A"}
                      color={getPaymentStatusChipColor(order.payment_status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Order Details">
                      <IconButton
                        size="small"
                        onClick={() => console.log(`View order: ${order.id}`)} // Replace with navigation later
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default OrdersManagement;
