
import { useState, useEffect } from 'react';
import { ArrowRight, Search, Map, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white -z-10"></div>
      
      {/* Background Pattern (subtle) */}
      <div className="absolute inset-0 opacity-[0.03] -z-10" style={{ 
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }}></div>

      {/* Content Container */}
      <div className="container-custom relative z-10 px-4 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className={`flex flex-col stagger-children ${loaded ? 'stagger-children-active' : ''}`}>
            <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-blue-100 text-blue-700 rounded-full inline-flex items-center justify-center w-fit mb-6">
              Ride Together, Save Together
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-balance mb-4">
              Community carpooling,<br />redefined for<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">Malaysia</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-xl">
              JiranRide connects neighbors for shared commutes, reducing traffic while building community bonds and saving costs.
            </p>
            
            {/* Search Box */}
            <div className="relative max-w-xl w-full mb-8">
              <div className="glass p-2 rounded-xl shadow-subtle">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="relative rounded-lg bg-white p-2 md:col-span-1 flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <input 
                      type="text" 
                      placeholder="From" 
                      className="flex-1 bg-transparent border-0 focus:ring-0 text-sm"
                    />
                  </div>
                  
                  <div className="relative rounded-lg bg-white p-2 md:col-span-1 flex items-center">
                    <Map className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <input 
                      type="text" 
                      placeholder="To" 
                      className="flex-1 bg-transparent border-0 focus:ring-0 text-sm"
                    />
                  </div>
                  
                  <Button className="md:col-span-1 w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Find Rides
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link to="/register">
                <Button className="btn-hover flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <Link to="/about" className="text-sm text-gray-600 flex items-center">
                <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8C0.5 3.85786 3.85786 0.5 8 0.5C12.1421 0.5 15.5 3.85786 15.5 8Z" stroke="currentColor" />
                    <path d="M8 4.5V8.5H11.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                Learn more about JiranRide
              </Link>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className={`flex justify-center items-center transition-opacity duration-700 ease-apple ${loaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative">
              {/* Main illustration */}
              <div className="relative w-full max-w-lg mx-auto animate-float">
                <div className="absolute top-0 left-0 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-40 h-40 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                
                <div className="relative">
                  <div className="glass rounded-xl overflow-hidden border border-white/40 shadow-elevation">
                    <div className="p-1">
                      <div className="rounded-lg overflow-hidden">
                        <div className="aspect-[4/3] bg-gradient-to-tr from-blue-50 to-blue-100 flex items-center justify-center">
                          <img 
                            src="https://images.unsplash.com/photo-1625134673337-519d4d10b313?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                            alt="People carpooling"
                            className="w-full h-full object-cover opacity-90"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats card */}
                  <div className="absolute -right-12 -bottom-10 glass rounded-xl p-4 shadow-elevation border border-white/40 backdrop-blur-md z-10 transform rotate-3 w-44">
                    <div className="text-xs font-medium text-gray-500 mb-1">Monthly savings</div>
                    <div className="text-xl font-semibold text-gray-900">RM 450</div>
                    <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-1 bg-green-500 rounded-full w-3/4"></div>
                    </div>
                  </div>
                  
                  {/* Location badge */}
                  <div className="absolute -left-10 top-10 glass rounded-full px-4 py-2 shadow-elevation border border-white/40 backdrop-blur-md z-10 transform -rotate-6 flex items-center">
                    <div className="rounded-full bg-blue-500 h-2 w-2 mr-2"></div>
                    <span className="text-xs font-medium">Kuala Lumpur</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="container-custom mt-16 md:mt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-1">12K+</div>
            <div className="text-sm text-gray-500">Active Users</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-1">5K+</div>
            <div className="text-sm text-gray-500">Rides Shared</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-1">230+</div>
            <div className="text-sm text-gray-500">Neighborhoods</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-1">45K+</div>
            <div className="text-sm text-gray-500">CO₂ Saved (kg)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
