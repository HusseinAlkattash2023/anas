import Footer from "./components/Footer/index";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/index";
import Login from "./pages/Authentication/Login/index";
import Signup from "./pages/Authentication/Signup/index";
import AddProduct from "./pages/Admin/AddProduct/index";
import ManageOrders from "./pages/Admin/ManageOrders/index";
import Orders from "./pages/Orders/index";
import Cart from "./pages/Cart/index";
import ProductInfo from "./pages/ProductInfo/index";
import PageNotFound from "./pages/PageNotFound/index";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/sign-up" element={<Signup />}></Route>
        <Route path="/admin/add-product" element={<AddProduct />}></Route>
        <Route path="/admin/manage-orders" element={<ManageOrders />}></Route>
        <Route path="/orders" element={<Orders />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/product-info/:productId" element={<ProductInfo />}></Route>
        <Route path="*" element={<PageNotFound />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;