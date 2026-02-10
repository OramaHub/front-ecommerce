import { AuthProvider } from "./contexts/AuthContext";
import { RoutesWrapper } from "./routes";

export function App() {
  return (
    <AuthProvider>
      <RoutesWrapper />
    </AuthProvider>
  )
}
