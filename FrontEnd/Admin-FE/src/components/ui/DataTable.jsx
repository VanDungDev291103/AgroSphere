import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Checkbox,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
  alpha,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import PropTypes from "prop-types";

// Hàm so sánh để sắp xếp
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Hàm sắp xếp mảng chính
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// Component TableHead
function EnhancedTableHead({
  columns,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  enableSelection,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}>
        {enableSelection && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all",
              }}
            />
          </TableCell>
        )}
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.numeric ? "right" : "left"}
            padding={column.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === column.id ? order : false}
            sx={{
              minWidth: column.minWidth,
              fontWeight: "bold",
              whiteSpace: "nowrap",
              borderBottom: "2px solid rgba(224, 224, 224, 1)",
              fontSize: "0.875rem",
              position: "sticky",
              top: 0,
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              zIndex: 1,
            }}
          >
            {column.sortable ? (
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : "asc"}
                onClick={createSortHandler(column.id)}
              >
                {column.label}
                {orderBy === column.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              column.label
            )}
          </TableCell>
        ))}
        {/* Actions column */}
        <TableCell
          align="right"
          sx={{
            fontWeight: "bold",
            whiteSpace: "nowrap",
            borderBottom: "2px solid rgba(224, 224, 224, 1)",
            fontSize: "0.875rem",
            minWidth: 120,
            position: "sticky",
            top: 0,
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            zIndex: 1,
          }}
        >
          Thao tác
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

// Thêm PropTypes
EnhancedTableHead.propTypes = {
  columns: PropTypes.array.isRequired,
  onSelectAllClick: PropTypes.func,
  order: PropTypes.oneOf(["asc", "desc"]),
  orderBy: PropTypes.string,
  numSelected: PropTypes.number,
  rowCount: PropTypes.number,
  onRequestSort: PropTypes.func.isRequired,
  enableSelection: PropTypes.bool,
};

// Component Toolbar
function EnhancedTableToolbar({
  numSelected,
  title,
  onDelete,
  filterComponent,
}) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
        position: "sticky",
        top: 0,
        zIndex: 2,
        backgroundColor: "white",
        borderBottom: "1px solid rgba(224, 224, 224, 0.7)",
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          Đã chọn {numSelected} mục
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Xóa">
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        filterComponent || (
          <Tooltip title="Lọc danh sách">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )
      )}
    </Toolbar>
  );
}

// Thêm PropTypes cho EnhancedTableToolbar
EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  title: PropTypes.string,
  onDelete: PropTypes.func,
  filterComponent: PropTypes.node,
};

// Component DataTable chính
const DataTable = ({
  columns,
  rows,
  title = "Danh sách",
  onEdit,
  onView,
  onDelete,
  enableSelection = true,
  filterComponent,
  defaultSortColumn = "id",
  defaultSortOrder = "asc",
  rowsPerPageOptions = [5, 10, 25, 50],
  renderActionButtons = null,
  totalItems,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  // Debug log
  console.log("DataTable received rows:", rows);
  console.log("DataTable columns:", columns);

  const [order, setOrder] = useState(defaultSortOrder);
  const [orderBy, setOrderBy] = useState(defaultSortColumn);
  const [selected, setSelected] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    if (!enableSelection) return;

    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    onPageChange(event, newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    onRowsPerPageChange(event);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleDeleteSelected = () => {
    if (onDelete) {
      onDelete(selected);
    }
    setSelected([]);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, borderRadius: 2, overflow: "hidden" }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          title={title}
          onDelete={handleDeleteSelected}
          filterComponent={filterComponent}
        />
        <TableContainer sx={{ maxHeight: "calc(100vh - 320px)" }}>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
            stickyHeader
          >
            <EnhancedTableHead
              columns={columns}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              enableSelection={enableSelection}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "rgba(0, 0, 0, 0.02)",
                        },
                        "&.Mui-selected, &.Mui-selected:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.08)",
                        },
                      }}
                    >
                      {enableSelection && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onClick={(event) => handleClick(event, row.id)}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.numeric ? "right" : "left"}
                            padding={column.disablePadding ? "none" : "normal"}
                          >
                            {column.format ? column.format(value, row) : value}
                          </TableCell>
                        );
                      })}
                      <TableCell align="right">
                        {renderActionButtons ? (
                          renderActionButtons(row)
                        ) : (
                          <>
                            {onView && (
                              <Tooltip title="Xem chi tiết">
                                <IconButton
                                  color="info"
                                  onClick={() => onView(row.id)}
                                  size="small"
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onEdit && (
                              <Tooltip title="Chỉnh sửa">
                                <IconButton
                                  color="primary"
                                  onClick={() => onEdit(row.id)}
                                  size="small"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onDelete && (
                              <Tooltip title="Xóa">
                                <IconButton
                                  color="error"
                                  onClick={() => onDelete([row.id])}
                                  size="small"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell
                    colSpan={columns.length + (enableSelection ? 2 : 1)}
                  />
                </TableRow>
              )}
              {rows.length === 0 && (
                <TableRow style={{ height: 200 }}>
                  <TableCell
                    colSpan={columns.length + (enableSelection ? 2 : 1)}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6" color="text.secondary">
                        Không có dữ liệu
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Chưa có thông tin người dùng nào trong hệ thống.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={totalItems || rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count}`
          }
        />
      </Paper>
    </Box>
  );
};

// Kiểm tra kiểu dữ liệu cho props
DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  title: PropTypes.string,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
  onDelete: PropTypes.func,
  enableSelection: PropTypes.bool,
  filterComponent: PropTypes.node,
  defaultSortColumn: PropTypes.string,
  defaultSortOrder: PropTypes.oneOf(["asc", "desc"]),
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  renderActionButtons: PropTypes.func,
  totalItems: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
};

export default DataTable;
