import { useState } from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Badge,
  InputBase,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import authService from "../../services/authService";

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  zIndex: theme.zIndex.drawer + 1,
}));

const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[100],
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
  },
  marginLeft: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
      "&:focus": {
        width: "30ch",
      },
    },
  },
}));

const ActionIcons = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const Header = ({ handleDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isNotificationsMenuOpen = Boolean(notificationsAnchorEl);

  const currentUser = authService.getCurrentUser();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/login";
  };

  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
        <PersonIcon sx={{ mr: 1 }} />
        Hồ sơ
      </MenuItem>
      <MenuItem component={Link} to="/settings" onClick={handleMenuClose}>
        <SettingsIcon sx={{ mr: 1 }} />
        Cài đặt
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <LogoutIcon sx={{ mr: 1 }} />
        Đăng xuất
      </MenuItem>
    </Menu>
  );

  const notificationsMenu = (
    <Menu
      anchorEl={notificationsAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isNotificationsMenuOpen}
      onClose={handleNotificationsMenuClose}
    >
      <MenuItem onClick={handleNotificationsMenuClose}>
        Đơn hàng mới #1234 vừa được tạo
      </MenuItem>
      <MenuItem onClick={handleNotificationsMenuClose}>
        5 người dùng mới đăng ký trong tuần này
      </MenuItem>
      <MenuItem onClick={handleNotificationsMenuClose}>
        Cảnh báo: Hết hàng sản phẩm XYZ
      </MenuItem>
      <MenuItem
        component={Link}
        to="/notifications"
        onClick={handleNotificationsMenuClose}
      >
        Xem tất cả thông báo
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          {/* Menu button for mobile */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo for mobile */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/dashboard"
            sx={{
              display: { xs: "flex", sm: "none" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            AgroSphere
          </Typography>

          {/* Search */}
          <SearchContainer>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Tìm kiếm..."
              inputProps={{ "aria-label": "search" }}
            />
          </SearchContainer>

          <Box sx={{ flexGrow: 1 }} />

          {/* Action icons */}
          <ActionIcons>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              onClick={handleNotificationsMenuOpen}
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="user account"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar
                alt={currentUser?.name || "User"}
                src="/user-avatar.png"
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </ActionIcons>
        </Toolbar>
      </StyledAppBar>
      {profileMenu}
      {notificationsMenu}
    </>
  );
};

export default Header;
