import CheckoutPage from "@/components/checkout/CheckoutPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
export default function Page(){
    return (
        <ProtectedRoute>
            <CheckoutPage/>
        </ProtectedRoute>
    );
}