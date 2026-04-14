import React, { Suspense, lazy, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./features/user/userSlice.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MobileBottomNav from "./components/MobileBottomNav.jsx";
import Loader from "./components/Loader.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const AboutUs = lazy(() => import("./pages/AboutUs.jsx"));
const ContactUs = lazy(() => import("./pages/ContactUs.jsx"));
const ProductDetails = lazy(() => import("./pages/ProductDetails.jsx"));
const Products = lazy(() => import("./pages/Products.jsx"));
const Register = lazy(() => import("./User/Register.jsx"));
const Login = lazy(() => import("./User/Login.jsx"));
const Profile = lazy(() => import("./User/Profile.jsx"));
const UpdateProfile = lazy(() => import("./User/UpdateProfile.jsx"));
const UpdatePassword = lazy(() => import("./User/UpdatePassword.jsx"));
const ForgotPassword = lazy(() => import("./User/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./User/ResetPassword.jsx"));
const Cart = lazy(() => import("./Cart/Cart.jsx"));
const Shipping = lazy(() => import("./Cart/Shipping.jsx"));
const OrderConfirm = lazy(() => import("./Cart/OrderConfirm.jsx"));
const Payment = lazy(() => import("./Cart/Payment.jsx"));
const PaymentSuccess = lazy(() => import("./Cart/PaymentSuccess.jsx"));
const MyOrders = lazy(() => import("./Orders/MyOrders.jsx"));
const OrderDetails = lazy(() => import("./Orders/OrderDetails.jsx"));
const Dashboard = lazy(() => import("./Admin/Dashboard.jsx"));
const ProductsList = lazy(() => import("./Admin/ProductsList.jsx"));
const CreateProduct = lazy(() => import("./Admin/CreateProduct.jsx"));
const UpdateProduct = lazy(() => import("./Admin/UpdateProduct.jsx"));
const UsersList = lazy(() => import("./Admin/UsersList.jsx"));
const UpdateRole = lazy(() => import("./Admin/UpdateRole.jsx"));
const OrdersList = lazy(() => import("./Admin/OrdersList.jsx"));
const UpdateOrder = lazy(() => import("./Admin/UpdateOrder.jsx"));
const ReviewsList = lazy(() => import("./Admin/ReviewsList.jsx"));
const Messages = lazy(() => import("./Admin/Messages.jsx"));

function App() {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch])
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/profile/update" element={<ProtectedRoute element={<UpdateProfile />} />} />
          <Route path="/password/update" element={<ProtectedRoute element={<UpdatePassword />} />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shipping" element={<ProtectedRoute element={<Shipping />} />} />
          <Route path="/order/confirm" element={<ProtectedRoute element={<OrderConfirm />} />} />
          <Route path="/process/payment" element={<ProtectedRoute element={<Payment />} />} />
          <Route path="/paymentSuccess" element={<ProtectedRoute element={<PaymentSuccess />} />} />
          <Route path="/orders/user" element={<ProtectedRoute element={<MyOrders />} />} />
          <Route path="/order/:orderId" element={<ProtectedRoute element={<OrderDetails />} />} />
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute element={<Dashboard />} adminOnly={true} />} />
          <Route path="/admin/products" element={<ProtectedRoute element={<ProductsList />} adminOnly={true} />} />
          <Route path="/admin/product/create" element={<ProtectedRoute element={<CreateProduct />} adminOnly={true} />} />
          <Route path="/admin/product/:updateId" element={<ProtectedRoute element={<UpdateProduct />} adminOnly={true} />} />
          <Route path="/admin/users" element={<ProtectedRoute element={<UsersList />} adminOnly={true} />} />
          <Route path="/admin/user/:userId" element={<ProtectedRoute element={<UpdateRole />} adminOnly={true} />} />
          <Route path="/admin/orders" element={<ProtectedRoute element={<OrdersList />} adminOnly={true} />} />
          <Route path="/admin/order/:orderId" element={<ProtectedRoute element={<UpdateOrder />} adminOnly={true} />} />
          <Route path="/admin/reviews" element={<ProtectedRoute element={<ReviewsList />} adminOnly={true} />} />
          <Route path="/admin/messages" element={<ProtectedRoute element={<Messages />} adminOnly={true} />} />
        </Routes>
      </Suspense>
      <MobileBottomNav />
    </Router>
  )
}

export default App
