import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import { Cart } from "./pages/Cart";

export function RoutesWrapper(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/carrinho" element={<Cart />} />
            </Routes>
        </BrowserRouter>
    )
}