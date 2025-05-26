
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import BioGenerator from "./pages/BioGenerator";
import CoverLetter from "./pages/CoverLetter";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/bio-generator" element={<BioGenerator />} />
            <Route path="/cover-letter" element={<CoverLetter />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
