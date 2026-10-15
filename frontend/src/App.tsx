// REPLACE: frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "@/pages/Welcome";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Onboarding from "@/pages/Onboarding";
import Journey from "@/pages/Journey";
import Lesson from "@/pages/Lesson";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import Learning from "@/pages/Learning";
import Project from "@/pages/Project";
import SectorDetail from "@/pages/SectorDetail";
import Backtest from "@/pages/Backtest";
import Glossary from "@/pages/Glossary";
import EditProfile from "@/pages/EditProfile";
import Markets from "@/pages/Markets";
import Learn from "@/pages/Learn";
import Practice from "@/pages/Practice";
import Steps from "@/pages/Steps";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import { SimpleModeProvider } from "@/components/SimpleMode";

function App() {
  return (
    <SimpleModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/glossary" element={<Glossary />} />

          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Journey />} />
            <Route path="/journey/:step" element={<Lesson />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/sectors" element={<Dashboard />} />
            <Route path="/sectors/:sector" element={<SectorDetail />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/backtest" element={<Backtest />} />
            <Route path="/project" element={<Project />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/steps" element={<Steps />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/profile" element={<EditProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SimpleModeProvider>
  );
}

export default App;