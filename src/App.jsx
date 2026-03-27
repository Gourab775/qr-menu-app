import { useEffect } from "react";
import { Route, Switch } from "wouter";
import { CartProvider } from "./hooks/useCart";
import { MenuProvider } from "./store/menuStore";
import { MenuPage } from "./pages/MenuPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { PaymentPage } from "./pages/PaymentPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { CartBar } from "./components/CartBar";

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
            <Switch>
              <Route path="/" component={MenuPage} />
              <Route path="/cart" component={CartPage} />
              <Route path="/checkout" component={CheckoutPage} />
              <Route path="/payment" component={PaymentPage} />
              <Route path="/order-success" component={OrderSuccessPage} />
              <Route component={NotFoundPage} />
            </Switch>
            <CartBar />
          </div>
        </div>
      </MenuProvider>
    </CartProvider>
  );
}
