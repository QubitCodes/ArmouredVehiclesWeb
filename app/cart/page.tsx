import CartPage from "@/components/cart/CartPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <CartPage />
    </ProtectedRoute>
  );
}
