import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Drawer,
  IconButton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  Settings as SettingsIcon,
  LocalOffer as LocalOfferIcon,
  Forum as ForumIcon,
  Info as InfoIcon,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  CheckCircle as CheckCircleIcon,
  MonetizationOn as MonetizationOnIcon,
  ListAlt as ListAltIcon,
  Notifications as NotificationsIcon,
  Home as HomeIcon,
} from "@mui/icons-material";

// Styled components
const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const SidebarLogo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "& img": {
    width: 40,
    height: 40,
    marginRight: theme.spacing(1),
  },
  "& h3": {
    margin: 0,
    color: theme.palette.primary.main,
    fontSize: 18,
    fontWeight: 600,
  },
}));

const SidebarItem = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: 8,
  marginBottom: 4,
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: active ? theme.palette.action.selected : "transparent",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const [openProductSubmenu, setOpenProductSubmenu] = useState(false);
  const [openOrderSubmenu, setOpenOrderSubmenu] = useState(false);

  const handleProductClick = () => {
    setOpenProductSubmenu(!openProductSubmenu);
  };

  const handleOrderClick = () => {
    setOpenOrderSubmenu(!openOrderSubmenu);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: "Sản phẩm",
      icon: <CategoryIcon />,
      submenu: true,
      onClick: handleProductClick,
      open: openProductSubmenu,
      items: [
        {
          text: "Tất cả sản phẩm",
          path: "/products",
        },
        {
          text: "Danh mục",
          path: "/categories",
        },
        {
          text: "Flash Sale",
          path: "/flash-sales",
        },
      ],
    },
    {
      text: "Đơn hàng",
      icon: <ShoppingCartIcon />,
      submenu: true,
      onClick: handleOrderClick,
      open: openOrderSubmenu,
      items: [
        {
          text: "Tất cả đơn hàng",
          path: "/orders",
        },
        {
          text: "Đang xử lý",
          path: "/orders/processing",
        },
        {
          text: "Đang giao hàng",
          path: "/orders/shipping",
        },
        {
          text: "Đã hoàn thành",
          path: "/orders/completed",
        },
        {
          text: "Đã huỷ",
          path: "/orders/cancelled",
        },
      ],
    },
    {
      text: "Người dùng",
      icon: <PeopleIcon />,
      path: "/users",
    },
    {
      text: "Địa chỉ người dùng",
      icon: <HomeIcon />,
      path: "/user-addresses",
    },
    {
      text: "Mã giảm giá",
      icon: <LocalOfferIcon />,
      path: "/coupons",
    },
    {
      text: "Diễn đàn",
      icon: <ForumIcon />,
      path: "/forum-posts",
    },
    {
      text: "Thông báo",
      icon: <NotificationsIcon />,
      path: "/notifications",
    },
    {
      text: "Cài đặt",
      icon: <SettingsIcon />,
      path: "/settings",
    },
  ];

  const drawerContent = (
    <>
      <SidebarLogo>
        <img src="/vite.svg" alt="Logo" />
        <h3>AgroSphere Admin</h3>
      </SidebarLogo>
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <div key={item.text}>
            {item.submenu ? (
              <>
                <ListItem disablePadding>
                  <SidebarItem onClick={item.onClick}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {item.open ? <ExpandLess /> : <ExpandMore />}
                  </SidebarItem>
                </ListItem>
                <Collapse in={item.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.items.map((subItem) => (
                      <ListItem key={subItem.text} disablePadding>
                        <SidebarItem
                          active={isActive(subItem.path) ? 1 : 0}
                          component={Link}
                          to={subItem.path}
                          sx={{ pl: 4 }}
                        >
                          <ListItemText primary={subItem.text} />
                        </SidebarItem>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem disablePadding>
                <SidebarItem
                  active={isActive(item.path) ? 1 : 0}
                  component={Link}
                  to={item.path}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </SidebarItem>
              </ListItem>
            )}
          </div>
        ))}
      </List>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <SidebarContainer
        component="nav"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <Drawer variant="permanent" open>
          {drawerContent}
        </Drawer>
      </SidebarContainer>

      {/* Mobile sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
