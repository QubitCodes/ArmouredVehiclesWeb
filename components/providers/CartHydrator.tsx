"use client";

import { useEffect } from "react";
import { hydrateCartFromServer } from "@/lib/cart-sync";
import { useAuth } from "@/lib/auth-context";

export default function CartHydrator() {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            hydrateCartFromServer();
        }
    }, [isAuthenticated]);

    return null;
}
