
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold text-gradient">WordCraft</span>
        </Link>
      </div>
      
      <nav className="hidden md:flex items-center gap-6">
        <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
          Home
        </Link>
        <Link to="/bio-generator" className="text-foreground/80 hover:text-foreground transition-colors">
          Bio Generator
        </Link>
        <Link to="/cover-letter" className="text-foreground/80 hover:text-foreground transition-colors">
          Cover Letter
        </Link>
        <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <Link to="/pricing" className="text-foreground/80 hover:text-foreground transition-colors">
          Pricing
        </Link>
      </nav>
      
      <div className="flex items-center gap-3">
        <Link to="/login">
          <Button variant="outline">Login</Button>
        </Link>
        <Link to="/signup">
          <Button className="bg-gradient-to-r from-wordcraft-purple to-wordcraft-pink hover:opacity-90">
            <Sparkles className="w-4 h-4 mr-2" />
            Sign Up
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
