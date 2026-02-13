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

export function RoutesWrapper(){
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
            </Routes>
        </BrowserRouter>
    )
}