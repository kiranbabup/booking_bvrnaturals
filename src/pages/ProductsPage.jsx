import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { products } from "../assets/data";
import { GoldText } from "../components/GoldAccentText";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

const CART_KEY = "bvr_cart";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({});

  useEffect(() => {
    const raw = window.localStorage.getItem(CART_KEY);
    if (raw) setCart(JSON.parse(raw));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    console.log(cart);
    
  }, [cart]);

  const addItem = (product) => {
    setCart((c) => {
      const existing = c[product.id] || { ...product, qty: 0 };
      const next = {
        ...c,
        [product.id]: { ...existing, qty: existing.qty + 1 },
      };
      return next;
    });
  };

  const decItem = (product) => {
    setCart((c) => {
      const existing = c[product.id];
      if (!existing) return c;
      const qty = existing.qty - 1;
      const next = { ...c };
      if (qty <= 0) delete next[product.id];
      else next[product.id] = { ...existing, qty };
      return next;
    });
  };

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
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/confirm-cart")}
          endIcon={<ShoppingCartOutlinedIcon />}
          disabled={Object.keys(cart).length === 0}
        >
          Cart
        </Button>
      </Box>
      <GoldText text="Our Products" />

      <Grid container spacing={2}>
        {products.map((p) => {
          const item = cart[p.id];
          return (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <Card sx={{ bgcolor: "#1c1c1e" }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={p.image}
                  alt={p.title}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#fff" }}>
                    {p.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ccc" }}>
                    {p.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Typography sx={{ color: "#fff", fontWeight: 700 }}>
                      ₹ {p.price}
                    </Typography>
                    {!item ? (
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => addItem(p)}
                      >
                        Add
                      </Button>
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          color="inherit"
                          onClick={() => decItem(p)}
                          sx={{ color: "#fff" }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography
                          sx={{ mx: 1, color: "#fff", fontWeight: "bold" }}
                        >
                          {item.qty}
                        </Typography>
                        <IconButton
                          color="inherit"
                          onClick={() => addItem(p)}
                          sx={{ color: "#fff" }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ProductsPage;
