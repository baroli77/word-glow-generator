
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import { ThemeToggle } from './ThemeToggle';
import { LogOut, Settings, Shield, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigate to home page after successful sign out
      navigate('/');
    } catch (error) {
      // Even if there's an error, navigate to home page
      navigate('/');
    }
  };

  // Check if user is admin directly as well for consistent behavior
  const isAdminUser = user?.email === 'obarton77@gmail.com' || isAdmin;

  return (
    <header className="bg-background border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="font-serif text-2xl font-bold text-gradient">MakeMy.Bio</h1>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          {/* Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1">
                <span>Tools</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link to="/bio-generator">Bio Generator</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/cover-letter">Cover Letter</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Resources Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1">
                <span>Resources</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link to="/examples">Examples</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/about">About</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/faq">FAQ</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Pricing as standalone link */}
          <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>

          {/* Dashboard for logged in users */}
          {user && (
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
          )}

          {/* Admin link for admin users */}
          {isAdminUser && (
            <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-makemybio-purple to-makemybio-pink flex items-center justify-center text-white text-sm font-bold">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline">{user.user_metadata?.full_name || user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {isAdminUser && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
