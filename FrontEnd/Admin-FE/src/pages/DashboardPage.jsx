import { useState, useEffect } from "react";
import { Grid, Box, Typography, Paper } from "@mui/material";
import {
  AttachMoney as AttachMoneyIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import StatCard from "../components/ui/StatCard";
import ChartCard from "../components/ui/ChartCard";
import DataTable from "../components/ui/DataTable";
import userService from "../services/userService";
import orderService from "../services/orderService";

const DashboardPage = () => {
  const [statistics, setStatistics] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [],
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulated data - Replace with actual API calls
        // Thống kê tổng quan
        setStatistics({
          totalSales: 45141,
          totalOrders: 423,
          totalUsers: 7929,
          totalProducts: 289,
        });

        // Dữ liệu biểu đồ doanh thu
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        setSalesData({
          labels: months,
          datasets: [
            {
              label: "Doanh thu năm 2024",
              data: [53, 42, 51, 54, 53, 58, 54, 60, 58, 62, 50, 58],
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4,
            },
            {
              label: "Lượt truy cập",
              data: [88, 74, 82, 98, 95, 83, 102, 87, 110, 92, 65, 69],
              borderColor: "rgba(255, 159, 64, 1)",
              backgroundColor: "rgba(255, 159, 64, 0.2)",
              tension: 0.4,
            },
          ],
        });

        // Lấy các đơn hàng gần đây
        const ordersResponse = await orderService.getRecentOrders(5);
        setRecentOrders(ordersResponse || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Cấu hình bảng đơn hàng gần đây
  const orderColumns = [
    { id: "id", label: "Mã đơn", minWidth: 80, sortable: true },
    { id: "customerName", label: "Khách hàng", minWidth: 150, sortable: true },
    { id: "date", label: "Ngày đặt", minWidth: 120, sortable: true },
    {
      id: "status",
      label: "Trạng thái",
      minWidth: 120,
      sortable: true,
      format: (value) => {
        const statusColors = {
          PENDING: "warning.main",
          PROCESSING: "info.main",
          SHIPPED: "primary.main",
          DELIVERED: "success.main",
          CANCELLED: "error.main",
        };

        return (
          <Typography
            component="span"
            sx={{
              color: statusColors[value] || "text.secondary",
              fontWeight: "medium",
            }}
          >
            {value === "PENDING" && "Chờ xử lý"}
            {value === "PROCESSING" && "Đang xử lý"}
            {value === "SHIPPED" && "Đang giao hàng"}
            {value === "DELIVERED" && "Đã giao hàng"}
            {value === "CANCELLED" && "Đã huỷ"}
          </Typography>
        );
      },
    },
    {
      id: "total",
      label: "Tổng tiền",
      minWidth: 120,
      sortable: true,
      numeric: true,
      format: (value) => `$${value.toLocaleString()}`,
    },
  ];

  // Tạo dữ liệu mẫu trong khi chờ API thực tế
  const sampleOrders = [
    {
      id: 1001,
      customerName: "Nguyễn Văn A",
      date: "2024-06-01",
      status: "DELIVERED",
      total: 1250,
    },
    {
      id: 1002,
      customerName: "Trần Thị B",
      date: "2024-06-02",
      status: "PROCESSING",
      total: 850,
    },
    {
      id: 1003,
      customerName: "Lê Văn C",
      date: "2024-06-03",
      status: "PENDING",
      total: 450,
    },
    {
      id: 1004,
      customerName: "Phạm Thị D",
      date: "2024-06-04",
      status: "SHIPPED",
      total: 1500,
    },
    {
      id: 1005,
      customerName: "Hoàng Văn E",
      date: "2024-06-05",
      status: "CANCELLED",
      total: 950,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Bảng điều khiển
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng doanh thu"
            value={`$${statistics.totalSales.toLocaleString()}`}
            subtitle="Tuần này"
            icon={<AttachMoneyIcon sx={{ fontSize: 36 }} />}
            color="primary"
            increasedBy={7}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng đơn hàng"
            value={statistics.totalOrders.toLocaleString()}
            subtitle="Đã hoàn thành tháng này"
            icon={<ShoppingCartIcon sx={{ fontSize: 36 }} />}
            color="secondary"
            increasedBy={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng người dùng"
            value={statistics.totalUsers.toLocaleString()}
            subtitle="Đã đăng ký"
            icon={<PersonIcon sx={{ fontSize: 36 }} />}
            color="info"
            increasedBy={18}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng sản phẩm"
            value={statistics.totalProducts.toLocaleString()}
            subtitle="Đang hoạt động"
            icon={<InventoryIcon sx={{ fontSize: 36 }} />}
            color="success"
            increasedBy={-3}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <ChartCard
            title="Phân tích doanh thu"
            subheader="Biểu đồ doanh thu và lượt truy cập năm 2024"
            chartType="line"
            data={salesData}
            options={{
              plugins: {
                legend: {
                  position: "top",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
            menuItems={[
              { label: "Xem theo tuần" },
              { label: "Xem theo tháng" },
              { label: "Xem theo năm" },
              { label: "Xuất báo cáo" },
            ]}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <ChartCard
            title="Người dùng theo tháng"
            subheader="Phân tích người dùng theo tháng"
            chartType="bar"
            data={{
              labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              datasets: [
                {
                  label: "Đăng ký",
                  data: [53, 42, 51, 54, 53, 58, 54, 60, 58, 62, 50, 58],
                  backgroundColor: "rgba(103, 58, 183, 0.5)",
                  borderColor: "rgb(103, 58, 183)",
                  borderWidth: 1,
                },
                {
                  label: "Hoạt động",
                  data: [88, 74, 82, 98, 95, 83, 102, 87, 110, 92, 65, 69],
                  backgroundColor: "rgba(255, 193, 7, 0.5)",
                  borderColor: "rgb(255, 193, 7)",
                  borderWidth: 1,
                },
              ],
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <DataTable
          columns={orderColumns}
          rows={recentOrders.length > 0 ? recentOrders : sampleOrders}
          title="Đơn hàng gần đây"
          enableSelection={false}
          onView={(id) => console.log(`View order ${id}`)}
          defaultRowsPerPage={5}
        />
      </Box>
    </Box>
  );
};

export default DashboardPage;
