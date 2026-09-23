import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "@/pages/Welcome";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import SectorDetail from "@/pages/SectorDetail";
import Backtest from "@/pages/Backtest";
import Glossary from "@/pages/Glossary";
import ProtectedRoute from "@/components/ProtectedRoute";
import EditProfile from "@/pages/EditProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/glossary" element={<Glossary />} />
                <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sectors/:sector"
          element={
            <ProtectedRoute>
              <SectorDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/backtest"
          element={
            <ProtectedRoute>
              <Backtest />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;