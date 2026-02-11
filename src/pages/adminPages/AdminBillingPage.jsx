import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  CircularProgress,
  IconButton,
  Button,
  Chip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TablePagination from "@mui/material/TablePagination";
import { firebasedb } from "../../services/firebase";
import {
  collection,
  query,
  orderBy,
  limit as fbLimit,
  startAfter,
  getDocs,
  doc,
  updateDoc,
  getCountFromServer,
} from "firebase/firestore";

// format ms-since-epoch to YYYY/MM/DD
function formatedDate(ms) {
  if (!ms) return "";
  const n = typeof ms === "number" ? ms : Number(ms);
  if (!n || Number.isNaN(n)) return "";
  const d = new Date(n);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
}

function StatusChip({ status, onChange }) {
  const colorMap = {
    pending: "primary",
    cancel: "error",
    confirmed: "success",
  };

  return (
    <Chip
      label={status}
      color={colorMap[status] || "default"}
      onClick={onChange}
      clickable
      variant="outlined"
    />
  );
}

function Row({ order, onUpdateStatus }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{order.sno}</TableCell>
        <TableCell>{formatedDate(order.addedOn)}</TableCell>
        <TableCell>{order.customerName || "N/A"}</TableCell>
        <TableCell>{order.phone || "N/A"}</TableCell>
        <TableCell>{order.altPhone || "N/A"}</TableCell>
        <TableCell>₹{order.total}</TableCell>
        <TableCell>
          <StatusChip
            status={order.order_status}
            onChange={() => {
              const next =
                order.order_status === "pending"
                  ? "confirmed"
                  : order.order_status === "confirmed"
                    ? "cancel"
                    : "pending";
              onUpdateStatus(order.id, next);
            }}
          />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom>
                Cart Items
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#506991" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Price
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Qty
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items?.map((it, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{it.title}</TableCell>
                      <TableCell>₹{it.price}</TableCell>
                      <TableCell>{it.qty}</TableCell>
                      <TableCell>₹{it.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function AdminBillingPage() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [cursors, setCursors] = useState([]); // store last docs for pages

  const bookingsCol = useMemo(() => collection(firebasedb, "bvrbookings"), []);

  const cursorsRef = React.useRef([]);

  const fetchCount = useCallback(async () => {
    try {
      const snapshot = await getCountFromServer(bookingsCol);
      setRowCount(snapshot.data().count || 0);
    } catch (e) {
      console.warn("count failed", e);
    }
  }, [bookingsCol]);

  const fetchPage = useCallback(
    async (pageIndex = 0, size = 10) => {
      setLoading(true);
      try {
        let q = query(bookingsCol, orderBy("addedOn", "desc"), fbLimit(size));

        if (pageIndex > 0 && cursorsRef.current[pageIndex - 1]) {
          q = query(
            bookingsCol,
            orderBy("addedOn", "desc"),
            startAfter(cursorsRef.current[pageIndex - 1]),
            fbLimit(size),
          );
        }

        const snap = await getDocs(q);
        const docs = snap.docs || [];

        setOrders(
          docs.map((d, i) => ({
            id: d.id,
            ...d.data(),
            sno: pageIndex * size + i + 1,
          })),
        );

        // store cursor safely
        cursorsRef.current[pageIndex] = docs[docs.length - 1] || null;
      } finally {
        setLoading(false);
      }
    },
    [bookingsCol], // ✅ no cursors here
  );

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  useEffect(() => {
    fetchPage(page, pageSize);
  }, [fetchPage, page, pageSize]);

  const handleChangePage = (_e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setPageSize(parseInt(event.target.value, 10));
    cursorsRef.current = [];
  };

  const onUpdateStatus = async (docId, newStatus) => {
    try {
      const docRef = doc(firebasedb, "bvrbookings", docId);
      await updateDoc(docRef, { order_status: newStatus });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === docId ? { ...o, order_status: newStatus } : o,
        ),
      );
    } catch (e) {
      console.error("update failed", e);
    }
  };

  return (
    <Box sx={{ width: "99%" }}>
      <TableContainer component={Paper}>
        <Table>
          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <CircularProgress color="primary" />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#0d3679" }}>
                  <TableCell />
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    S No
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Order Date
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Customer Name
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Contact
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Alt Contact
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Total
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orders.map((order) => (
                  <Row
                    key={order.id}
                    order={order}
                    onUpdateStatus={onUpdateStatus}
                  />
                ))}
              </TableBody>
            </>
          )}
        </Table>
        <TablePagination
          component="div"
          count={rowCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </TableContainer>
    </Box>
  );
}
