import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { RoutesWrapper } from "./routes";

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RoutesWrapper />
      </CartProvider>
    </AuthProvider>
  )
}
