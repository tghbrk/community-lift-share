
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="container-custom text-center px-4">
          <div className="max-w-md mx-auto">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center blur-xl opacity-30">
                <div className="text-[240px] font-bold text-primary">
                  404
                </div>
              </div>
              
              <div className="relative z-10">
                <h1 className="text-9xl font-display font-bold text-gray-900">
                  404
                </h1>
              </div>
            </div>
            
            <h2 className="text-2xl font-display font-semibold mb-4">
              Page not found
            </h2>
            <p className="text-gray-600 mb-8">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <Button 
                variant="outline" 
                className="btn-hover" 
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              
              <Link to="/">
                <Button className="btn-hover w-full sm:w-auto">
                  <Home className="mr-2 h-4 w-4" />
                  Return Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
