'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
    const { user, isAuthenticated } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        if (!isAuthenticated) {
            setCartItems([]);
            setCartCount(0);
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.get('/api/cart');
            if (data.success) {
                setCartItems(data.data.items || []);
                const count = (data.data.items || []).reduce((acc, item) => acc + item.quantity, 0);
                setCartCount(count);
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [isAuthenticated]);

    // Update cart count when adding items
    const refreshCart = () => {
        fetchCart();
    };

    const value = {
        cartItems,
        cartCount,
        loading,
        refreshCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
