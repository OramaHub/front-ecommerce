import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import { Cart } from "./pages/Cart";
import { LoginPage } from "./pages/LoginPage";
import { CreateAccountPage } from "./pages/CreateAccountPage";
import { AllProductsPage } from "./pages/AllProductsPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
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
                </Route>
            </Routes>
        </BrowserRouter>
    )
}