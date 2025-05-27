
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as HotToaster } from "react-hot-toast";
import Index from "./pages/Index";
import BioGenerator from "./pages/BioGenerator";
import CoverLetter from "./pages/CoverLetter";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Examples from "./pages/Examples";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import AdminDashboard from "./pages/AdminDashboard";
import PricingPage from "./pages/Pricing";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/bio-generator" element={<BioGenerator />} />
              <Route path="/cover-letter" element={<CoverLetter />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/examples" element={<Examples />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
          <HotToaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
              success: {
                style: {
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(142.1 76.2% 36.3%)',
                },
                iconTheme: {
                  primary: 'hsl(142.1 76.2% 36.3%)',
                  secondary: 'hsl(var(--background))',
                },
              },
              error: {
                style: {
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--destructive))',
                },
                iconTheme: {
                  primary: 'hsl(var(--destructive))',
                  secondary: 'hsl(var(--background))',
                },
              },
            }}
          />
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
