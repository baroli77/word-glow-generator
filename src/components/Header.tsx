
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Sparkles, Menu, X, Shield } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full py-4 px-4 sm:px-6 flex items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-xl sm:text-2xl font-bold text-gradient">WordCraft</span>
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-6">
        <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
          Home
        </Link>
        <Link to="/bio-generator" className="text-foreground/80 hover:text-foreground transition-colors">
          Bio Generator
        </Link>
        <Link to="/cover-letter" className="text-foreground/80 hover:text-foreground transition-colors">
          Cover Letter
        </Link>
        {user && (
          <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
            Dashboard
          </Link>
        )}
        {isAdmin && (
          <Link to="/admin" className="text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1">
            <Shield className="w-4 h-4" />
            Admin
          </Link>
        )}
        <Link to="/pricing" className="text-foreground/80 hover:text-foreground transition-colors">
          Pricing
        </Link>
      </nav>
      
      {/* Desktop Actions */}
      <div className="hidden lg:flex items-center gap-3">
        <ThemeToggle />
        {user ? (
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        ) : (
          <>
            <Link to="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-gradient-to-r from-wordcraft-purple to-wordcraft-pink hover:opacity-90">
                <Sparkles className="w-4 h-4 mr-2" />
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex lg:hidden items-center gap-2">
        <ThemeToggle />
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMenu}
          className="w-9 h-9"
        >
          {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border/40 lg:hidden">
          <nav className="flex flex-col p-4 space-y-4">
            <Link 
              to="/" 
              className="text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/bio-generator" 
              className="text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Bio Generator
            </Link>
            <Link 
              to="/cover-letter" 
              className="text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Cover Letter
            </Link>
            {user && (
              <Link 
                to="/dashboard" 
                className="text-foreground/80 hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-foreground/80 hover:text-foreground transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
            <Link 
              to="/pricing" 
              className="text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-border/40">
              {user ? (
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-wordcraft-purple to-wordcraft-pink hover:opacity-90">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
