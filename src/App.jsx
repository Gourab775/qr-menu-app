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

function AppRoutes() {
  const [isTableRoute, params] = useRoute("/t/:tableId");
  const [location] = useLocation();

  useEffect(() => {
    if (params?.tableId) {
      sessionStorage.setItem("tableId", params.tableId);
    }
  }, [params?.tableId]);

  if (!isTableRoute && location === "/") {
    return <TableRequiredPage />;
  }

  if (!isTableRoute && location !== "/") {
    return <NotFoundPage />;
  }

  return (
    <>
      <Switch>
        <Route path="/" component={MenuPage} />
        <Route path="/t/:tableId" component={MenuPage} />
        <Route path="/cart" component={CartPage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/payment" component={PaymentPage} />
        <Route path="/order-success" component={OrderSuccessPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <CartBar />
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
