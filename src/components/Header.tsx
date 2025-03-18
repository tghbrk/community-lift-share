
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Menu, X, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, isAuthenticated } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Extract initials from user data if available
  const getUserInitials = () => {
    if (!user) return 'U';
    
    // Try to use metadata if available
    const metadata = user.user_metadata;
    if (metadata && metadata.first_name && metadata.last_name) {
      return `${metadata.first_name[0]}${metadata.last_name[0]}`;
    }
    
    // Fall back to email
    return user.email?.[0].toUpperCase() || 'U';
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-apple py-4 px-4 md:px-8",
      isScrolled ? "bg-white/80 backdrop-blur-md shadow-subtle" : "bg-transparent"
    )}>
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            JiranRide
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/rides" className="nav-item">Find Rides</Link>
          <Link to="/offer" className="nav-item">Offer a Ride</Link>
          <Link to="/community" className="nav-item">Community</Link>
          <Link to="/about" className="nav-item">About Us</Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-rides">My Rides</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button onClick={() => signOut()} className="w-full text-left">
                    Log out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" size="sm" className="btn-hover">
                  Login
                </Button>
              </Link>
              <Link to="/auth?tab=register">
                <Button size="sm" className="btn-hover flex items-center">
                  Get Started
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center justify-center" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 bg-white z-40 pt-20 px-6 transform transition-transform duration-300 ease-apple md:hidden",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <nav className="flex flex-col space-y-6">
          <Link to="/rides" className="flex items-center text-lg font-medium border-b border-gray-100 pb-4" onClick={() => setIsMenuOpen(false)}>
            <MapPin className="mr-3 h-5 w-5 text-primary" />
            Find Rides
          </Link>
          <Link to="/offer" className="flex items-center text-lg font-medium border-b border-gray-100 pb-4" onClick={() => setIsMenuOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-primary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.8 2 11 2 11.3V15c0 .6.4 1 1 1h1"/><path d="M10.3 17H16"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/></svg>
            Offer a Ride
          </Link>
          <Link to="/community" className="flex items-center text-lg font-medium border-b border-gray-100 pb-4" onClick={() => setIsMenuOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-primary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Community
          </Link>
          <Link to="/about" className="flex items-center text-lg font-medium border-b border-gray-100 pb-4" onClick={() => setIsMenuOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-primary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            About Us
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="flex items-center text-lg font-medium border-b border-gray-100 pb-4" onClick={() => setIsMenuOpen(false)}>
                <User className="mr-3 h-5 w-5 text-primary" />
                My Profile
              </Link>
              <button 
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="flex items-center text-lg font-medium border-b border-gray-100 pb-4 text-red-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-red-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Log Out
              </button>
            </>
          ) : (
            <Link to="/auth" className="flex items-center text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              <User className="mr-3 h-5 w-5 text-primary" />
              Login / Register
            </Link>
          )}
        </nav>
        
        {!isAuthenticated && (
          <div className="absolute bottom-12 left-0 right-0 px-6">
            <Link to="/auth?tab=register" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full py-6 btn-hover flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
