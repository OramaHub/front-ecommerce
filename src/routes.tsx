import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import { Cart } from "./pages/Cart";
import { LoginPage } from "./pages/LoginPage";
import { CreateAccountPage } from "./pages/CreateAccountPage";
import { AllProductsPage } from "./pages/AllProductsPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { MyAccountPage } from "./pages/MyAccountPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { Layout } from "./components/Layout";
import { AdminRoute } from "./components/AdminRoute";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage";
import { AdminClientsPage } from "./pages/admin/AdminClientsPage";

export function RoutesWrapper() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/produtos" element={<AllProductsPage />} />
          <Route path="/produto/:id" element={<ProductDetailsPage />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CreateAccountPage />} />
          <Route path="/minha-conta" element={<MyAccountPage />} />
          <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
          <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/produtos" element={<AdminProductsPage />} />
            <Route path="/admin/pedidos" element={<AdminOrdersPage />} />
            <Route path="/admin/clientes" element={<AdminClientsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
