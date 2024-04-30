import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/navbar";

// login signup imports
import Login from "./components/login_signup/login";
import MainSignup from "./components/login_signup/MainSignup";
// import CustomerSignup from "./components/login_signup/CustomerSignup";
// import CourierSignup from "./components/login_signup/CourierSignup";
// import VendorSignup from "./components/login_signup/VendorSignup";
// import StudentVendorSignup from "./components/login_signup/StudentVendorSignup";
import { AuthProvider } from "./components/login_signup/AuthContext";
import ProtectedRoute from "./components/login_signup/ProtectedRoute";

// customer imports
import CustomerHome from "./components/customer/CustomerHome";
import CustomerReview from "./components/customer/CustomerReview";
import SearchResultsPage from "./components/customer/SearchResultsPage";
import CustomerPlaceOrder from "./components/customer/CustomerPlaceOrder";
import CustomerViewCart from "./components/customer/CustomerViewCart";
import CustomerCurrentOrder from "./components/customer/CustomerCurrentOrder";
import CustomerViewMenu from "./components/customer/CustomerViewMenu";
import CustomerUpdateInfo from "./components/customer/CustomerUpdateInfo";

// vender imports
import StudentVendorHome from "./components/StudentVendorHome";
import VendorHome from "./components/vendor/VendorHome";
import AddItem from "./components/vendor/AddItem";
import ViewCustomersReviews from "./components/vendor/ViewCustomerReviews";
import VendorProfile from "./components/vendor/vendorProfile";
import VendorOrders from "./components/vendor/VendorOrders";
import VendorUpdate from "./components/vendor/vendorUpdate";

// courier imports
import CourierHome from "./components/courier/CourierHome";
import SeeOrders from "./components/courier/SeeOrders";
import CourierAnalytics from "./components/courier/courierAnalytics";
import CourierUpdateInfo from "./components/courier/CourierUpdateInfo";
//admin imports
import AdminHome from "./components/admin/AdminHome";
import SeeVendorReviews from "./components/admin/SeeVendorReviews";
import SeeVendorRequests from "./components/admin/SeeVendorRequests";
import BanVendors from "./components/admin/BanVendors";
import SeeCourierRequests from "./components/admin/SeeCourierRequests";

// NOTE : the protected element is a JWT tokken implementation so that only specific users with specific roles can access certain pages however certain of those elements are commented out due to issues in merging and will be fixed by the next phase
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/MainSignup" element={<MainSignup />} />
          {/* <Route path="/CustomerSignup" element={<CustomerSignup />} />
          <Route path="/CourierSignup" element={<CourierSignup />} />
          <Route path="/VendorSignup" element={<VendorSignup />} />

          <Route
            path="/StudentVendorSignup"
            element={<StudentVendorSignup />}
          /> */}

          {/* Layout with Navbar */}
          <Route element={<LayoutWithNavbar />}>
            {/* Protected Routes with Navbar */}
            <Route path="/VendorHome" element={<VendorHome />} />
            <Route path="/AddItem" element={<AddItem />} />
            <Route path="/VendorProfile" element={<VendorProfile />} />
            <Route path="/VendorOrders" element={<VendorOrders />} />
            <Route path="/VendorUpdate" element={<VendorUpdate />} />
            VendorUpdate
            <Route
              path="/ViewCustomersReviews"
              element={<ViewCustomersReviews />}
            />
            <Route
              path="/CustomerHome"
              element={
                // <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerHome />
                // </ProtectedRoute>
              }
            />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/PlaceOrder" element={<CustomerPlaceOrder />} />
            <Route path="/ViewCart" element={<CustomerViewCart />} />
            <Route path="/CurrentOrder" element={<CustomerCurrentOrder />} />
            <Route path="/CustomerViewMenu" element={<CustomerViewMenu />} />
            <Route
              path="/CustomerUpdateInfo"
              element={<CustomerUpdateInfo />}
            />
            <Route path="/CourierHome" element={<CourierHome />} />
            <Route
              path="/StudentVendorHome"
              element={
                <ProtectedRoute allowedRoles={["student_vendor"]}>
                  <StudentVendorHome />
                </ProtectedRoute>
              }
            />
            <Route path="/VendorHome" element={<VendorHome />} />
            <Route
              path="/AdminHome"
              element={
                // <ProtectedRoute allowedRoles={["admin"]}>
                <AdminHome />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/SeeOrders"
              element={
                // <ProtectedRoute allowedRoles={["Admin"]}>
                <SeeOrders />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/CourierUpdateInfo"
              element={
                // <ProtectedRoute allowedRoles={["Admin"]}>
                <CourierUpdateInfo />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/CourierAnalytics"
              element={
                // <ProtectedRoute allowedRoles={["Admin"]}>
                <CourierAnalytics />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/CourierUpdateInfo"
              element={
                <ProtectedRoute allowedRoles={["courier"]}>
                  <CourierUpdateInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/CustomerReview"
              element={
                //<ProtectedRoute allowedRoles={["customer"]}>
                <CustomerReview />
                //</ProtectedRoute>
              }
            />
            <Route
              path="/AddItem"
              element={
                <ProtectedRoute allowedRoles={["vendor", "student_vendor"]}>
                  <AddItem />
                </ProtectedRoute>
              }
            />
            <Route
              path="/SeeOrders"
              element={
                <ProtectedRoute allowedRoles={["courier"]}>
                  <SeeOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seeVendorRatings"
              element={
                // <ProtectedRoute allowedRoles={["admin"]}>
                <SeeVendorReviews />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/joinRequests"
              element={
                // <ProtectedRoute allowedRoles={["admin"]}>
                <SeeVendorRequests />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/banUser"
              element={
                // <ProtectedRoute allowedRoles={["admin"]}>
                <BanVendors />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/view-courier-requests"
              element={
                // <ProtectedRoute allowedRoles={["admin"]}>
                <SeeCourierRequests />
                // </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function LayoutWithNavbar() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
