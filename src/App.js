import { Route, Routes } from "react-router-dom";
import HomeLogin from "./Components/HomeLogin";
import LoginPage from "./Pages/LoginPage";
import DashboardPage from "./Pages/DashboardPage";
import StockDetailsPage from "./Components/StockDetailsPage";
import TransactionPage from "./Pages/TransactionPage";
import DebitorPage from "./Pages/DebitorPage";
import CreditorPage from "./Pages/CreditorPage";
import { useEffect } from "react";


function App() {
  useEffect(() => {
    document.addEventListener('contextmenu', event => event.preventDefault());

    document.addEventListener('keydown', event => {
      // Check if Ctrl+Shift+I (or Cmd+Option+I on Mac) is pressed
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.keyCode === 73) {
        event.preventDefault();
      }
    });

    // Clean up event listeners when component unmounts
    return () => {
      document.removeEventListener('contextmenu', event => event.preventDefault());
      document.removeEventListener('keydown', event => {
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.keyCode === 73) {
          event.preventDefault();
        }
      });
    };
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomeLogin />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/stocks/:category" element={<StockDetailsPage />} />
        <Route path="/stocks/transaction-stocks" element={<TransactionPage />} />
        <Route path="/stocks/debitor" element={<DebitorPage />} />
        <Route path="/stocks/creditor" element={<CreditorPage />} />
      </Routes>
    </div>
  );
}

export default App;
