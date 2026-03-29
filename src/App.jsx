import { useEffect } from "react";
import { Route, Switch, useRoute, useLocation } from "wouter";
import { CartProvider } from "./hooks/useCart";
import { MenuProvider } from "./store/menuStore";
import { MenuPage } from "./pages/MenuPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { PaymentPage } from "./pages/PaymentPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { TableRequiredPage } from "./pages/TableRequiredPage";
import { CartBar } from "./components/CartBar";

const TABLE_KEY = "tableId";

function getStoredTableId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TABLE_KEY);
}

function AppRoutes() {
  const [isTableRoute, tableParams] = useRoute("/t/:tableId");
  const [isCartRoute, cartParams] = useRoute("/t/:tableId/cart");
  const [isCheckoutRoute] = useRoute("/t/:tableId/checkout");
  const [isPaymentRoute] = useRoute("/t/:tableId/payment");
  const [isOrderSuccessRoute] = useRoute("/t/:tableId/order-success");
  const [location, setLocation] = useLocation();

  const tableId = tableParams?.tableId || cartParams?.tableId;

  useEffect(() => {
    const stored = getStoredTableId();
    if (!isTableRoute && !isCartRoute && !isCheckoutRoute && !isPaymentRoute && !isOrderSuccessRoute) {
      if (stored && location === "/") {
        setLocation(`/t/${stored}`);
      }
    }
  }, [location, isTableRoute, isCartRoute, isCheckoutRoute, isPaymentRoute, isOrderSuccessRoute, setLocation]);

  useEffect(() => {
    if (tableId) {
      localStorage.setItem(TABLE_KEY, tableId);
    }
  }, [tableId]);

  if (!isTableRoute && !isCartRoute && !isCheckoutRoute && !isPaymentRoute && !isOrderSuccessRoute && location === "/") {
    return <TableRequiredPage />;
  }

  if (!isTableRoute && !isCartRoute && !isCheckoutRoute && !isPaymentRoute && !isOrderSuccessRoute) {
    return <NotFoundPage />;
  }

  const showCartBar = isTableRoute || isCartRoute;

  return (
    <>
      <Switch>
        <Route path="/" component={MenuPage} />
        <Route path="/t/:tableId" component={MenuPage} />
        <Route path="/t/:tableId/cart" component={CartPage} />
        <Route path="/t/:tableId/checkout" component={CheckoutPage} />
        <Route path="/t/:tableId/payment" component={PaymentPage} />
        <Route path="/t/:tableId/order-success" component={OrderSuccessPage} />
        <Route component={NotFoundPage} />
      </Switch>
      {showCartBar && <CartBar />}
    </>
  );
}

export default function App() {
  useEffect(() => {
    let lastTouchEnd = 0;
    const handleTouchEnd = (event) => {
      if (!event.cancelable) return;
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    };
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
    return () => document.removeEventListener("touchend", handleTouchEnd);
  }, []);

  return (
    <CartProvider>
      <MenuProvider>
        <div className="appBackdrop">
          <div className="phoneFrame">
            <AppRoutes />
          </div>
        </div>
      </MenuProvider>
    </CartProvider>
  );
}
