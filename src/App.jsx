import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Page404 from "./pages/Page404";
import LoginNewPage from "./pages/LoginNewPage";
import ProductsPage from "./pages/ProductsPage";
import BookingPage from "./pages/BookingPage";
import AdminDashboard from "./pages/adminPages/AdminDashboard";

function App() {
  return (
    <div>
      <Routes>
        {/* home */}
        <Route path="/" element={<Navigate to="/products-list" />} />
        <Route path="/404" element={<Page404 />} />

        <Route path="/products-list" element={<ProductsPage />} />
        <Route path="/confirm-cart" element={<BookingPage />} />
        
        <Route path="/bvr-login" element={<LoginNewPage />} />
        {/* <Route path="/bvr_super_admin" element={<BvrSuperAdminApp />} /> */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />


        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default App;
