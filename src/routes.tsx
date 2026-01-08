import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import { Cart } from "./pages/Cart";
import { Layout } from "./components/Layout";

export function RoutesWrapper(){
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/carrinho" element={<Cart />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}