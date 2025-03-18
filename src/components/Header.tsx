
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { Car, Menu, User, LogOut, LayoutDashboard } from "lucide-react";

const Header = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-xl text-primary"
          >
            <Car className="h-6 w-6" />
            <span>JiranRide</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            to="/community"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Community
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex md:items-center md:gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <span className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/auth?mode=login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth?mode=register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b p-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/community"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Community
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  className="text-sm font-medium text-left text-red-500"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button variant="outline" asChild>
                  <Link to="/auth?mode=login" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/auth?mode=register" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
