import { Box, Typography, Button, IconButton, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoldText } from "../components/GoldAccentText";
import SnackbarCompo from "../components/SnackbarCompo";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { firebasedb } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

const CART_KEY = "bvr_cart";

const gridTextFieldStyle = {
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  gap: 2,
  width: "100%",
  mb: 2,
};

const BookingPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({});
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [address, setAddress] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackMode, setSnackMode] = useState("success");

  useEffect(() => {
    const raw = window.localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    setCart(parsed);
  }, []);

  useEffect(() => {
    console.log(cart);

    const arr = Object.values(cart || {}).map((it) => ({
      id: it.id,
      title: it.title,
      price: it.price,
      wgt: it.wgt || 0,
      qty: it.qty || 0,
      amount: (it.qty || 0) * it.price,
    }));
    setItems(arr);
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const inc = (id) => {
    setCart((c) => ({ ...c, [id]: { ...c[id], qty: (c[id].qty || 0) + 1 } }));
  };
  const dec = (id) => {
    setCart((c) => {
      const existing = c[id];
      if (!existing) return c;
      const qty = existing.qty - 1;
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = { ...existing, qty };
      return next;
    });
  };

  const total = items.reduce((s, it) => s + it.amount, 0);

  const closeSnack = () => setSnackOpen(false);

  const onlyDigitsKeyDown = (e) => {
    const allowed = ["Backspace", "ArrowLeft", "ArrowRight", "Tab", "Delete"];
    if (allowed.includes(e.key)) return;
    if (!/^[0-9]$/.test(e.key)) e.preventDefault();
  };

  const submitOrder = async () => {
    if (!name.trim()) return alert("Please enter customer name");
    if (phone.length !== 10) return alert("Primary phone must be 10 digits");
    if (altPhone && altPhone.length !== 10)
      return alert("Alternate phone must be 10 digits");
    if (!address.trim()) return alert("Please enter address");
    if (items.length === 0) return alert("Cart is empty");

    const payload = {
      items,
      total,
      customerName: name,
      phone,
      altPhone: altPhone || null,
      address,
      addedOn: Date.now(),
      order_status: "pending",
    };

    try {
      await addDoc(collection(firebasedb, "bvrbookings"), payload);
      setSnackMsg("Order placed successfully");
      setSnackMode("success");
      setSnackOpen(true);
      // clear cart
      setCart({});
      window.localStorage.removeItem(CART_KEY);
    } catch (e) {
      setSnackMsg("Failed to place order");
      setSnackMode("error");
      setSnackOpen(true);
    }
  };

  if (!items || items.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#0f0f10",
          color: "#fff",
          p: 2,
        }}
      >
        <ShoppingCartOutlinedIcon sx={{ fontSize: 80, mb: 2 }} />
        <GoldText text="Your cart is empty" />
        <Button variant="contained" onClick={() => navigate("/products-list")}>
          Back to Products
        </Button>
        <SnackbarCompo
          successSnackbarOpen={snackOpen}
          handleSnackbarClose={closeSnack}
          snackbarContent={snackMsg}
          snackbarMode={snackMode}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0f0f10", color: "#fff", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box component="img" src="/bvrLogo.png" width={60} height={60} />
        <Button
          color="white"
          onClick={() => window.location.replace("https://bvrnaturals.com")}
        >
          Home
        </Button>
        <Button color="white" onClick={() => navigate("/products-list")}>
          View Products
        </Button>
      </Box>

      <GoldText text="Confirm Your Booking" />

      <Box sx={{ width: "100%", overflowX: "auto", mb: 1 }}>
        <Box
          sx={{
            display: { xs: "none", md: "grid" },
            gridTemplateColumns: "40px 1fr 120px 140px 120px 120px",
            gap: 2,
            p: 1,
            alignItems: "center",
            bgcolor: "#121212",
            borderRadius: 1,
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>S.no</Typography>
          <Typography sx={{ fontWeight: 700 }}>Product Name</Typography>
          <Typography sx={{ fontWeight: 700 }}>Price</Typography>
          <Typography sx={{ fontWeight: 700 }}>Quantity</Typography>
          <Typography sx={{ fontWeight: 700 }}>Weight</Typography>
          <Typography sx={{ fontWeight: 700 }}>Amount</Typography>
        </Box>

        {items.map((it, idx) => (
          <Box key={it.id} sx={{ mb: 2 }}>
            {/* Mobile card view */}
            <Box
              sx={{
                display: { xs: "block", md: "none" },
                p: 1,
                bgcolor: "#121212",
                borderRadius: 1,
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>
                {idx + 1}. {it.title}
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography sx={{ color: "#ccc" }}>Price:</Typography>
                <Typography>₹ {it.price}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 1,
                  alignItems: "center",
                }}
              >
                <Typography sx={{ color: "#ccc" }}>Quantity:</Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton sx={{ color: "#fff" }} onClick={() => dec(it.id)}>
                    <RemoveIcon />
                  </IconButton>
                  <Typography sx={{ mx: 1 }}>{it.qty}</Typography>
                  <IconButton sx={{ color: "#fff" }} onClick={() => inc(it.id)}>
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography sx={{ color: "#ccc" }}>Weight:</Typography>
                <Typography>{it.wgt * it.qty} ml</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography sx={{ color: "#ccc" }}>Amount:</Typography>
                <Typography>₹ {it.amount}</Typography>
              </Box>
            </Box>

            {/* Desktop row view */}
            <Box
              sx={{
                display: { xs: "none", md: "grid" },
                gridTemplateColumns: "40px 1fr 120px 140px 120px 120px",
                gap: 2,
                p: 1,
                alignItems: "center",
                borderBottom: "1px solid #222",
              }}
            >
              <Typography>{idx + 1}</Typography>
              <Typography>{it.title}</Typography>
              <Typography>₹ {it.price}</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton sx={{ color: "#fff" }} onClick={() => dec(it.id)}>
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 1 }}>{it.qty}</Typography>
                <IconButton sx={{ color: "#fff" }} onClick={() => inc(it.id)}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Typography>{it.wgt * it.qty} ml</Typography>
              <Typography>₹ {it.amount}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mr: { md: 10, xs: 2 },
          mb: 1,
        }}
      >
        <Typography variant="h6">Total Amount: ₹ {total}</Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          px: 1,
        }}
      >
        <Box sx={{ maxWidth: 700 }}>
          <Box sx={gridTextFieldStyle}>
            <label style={{ fontWeight: "bold", color: "#fff", minWidth: 200 }}>
              Customer Full Name:
            </label>
            <TextField
              sx={{ width: { xs: "300px", md: "500px" } }}
              label="Customer Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                sx: { backgroundColor: "#fff", borderRadius: 1, marginTop: 1 },
              }}
            />
          </Box>
          <Box sx={gridTextFieldStyle}>
            <label style={{ fontWeight: "bold", color: "#fff", minWidth: 200 }}>
              Phone Number:
            </label>
            <TextField
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.slice(0, 10))}
              onKeyDown={onlyDigitsKeyDown}
              sx={{ width: { xs: "300px", md: "500px" } }}
              inputProps={{ maxLength: 10 }}
              InputProps={{
                sx: { backgroundColor: "#fff", borderRadius: 1, marginTop: 1 },
              }}
            />
          </Box>
          <Box sx={gridTextFieldStyle}>
            <label style={{ fontWeight: "bold", color: "#fff", minWidth: 200 }}>
              Alternate Phone Number
            </label>
            <TextField
              label="Alternate Phone Number"
              value={altPhone}
              onChange={(e) => setAltPhone(e.target.value.slice(0, 10))}
              onKeyDown={onlyDigitsKeyDown}
              sx={{ width: { xs: "300px", md: "500px" } }}
              inputProps={{ maxLength: 10 }}
              InputProps={{
                sx: { backgroundColor: "#fff", borderRadius: 1, marginTop: 1 },
              }}
            />
          </Box>
          <Box sx={gridTextFieldStyle}>
            <label style={{ fontWeight: "bold", color: "#fff", minWidth: 200 }}>
              Address:
            </label>
            <TextField
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              multiline
              rows={3}
              sx={{ width: { xs: "300px", md: "500px" } }}
              InputProps={{
                sx: { backgroundColor: "#fff", borderRadius: 1, marginTop: 1 },
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: { md: 10 },
        }}
      >
        <Button
          variant="outlined"
          color="error"
          onClick={() => navigate("/products-list")}
        >
          Back
        </Button>
        <Button variant="contained" color="success" onClick={submitOrder}>
          Submit
        </Button>
      </Box>

      <SnackbarCompo
        successSnackbarOpen={snackOpen}
        handleSnackbarClose={closeSnack}
        snackbarContent={snackMsg}
        snackbarMode={snackMode}
      />
    </Box>
  );
};

export default BookingPage;
