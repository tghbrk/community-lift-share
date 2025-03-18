
import { useState } from 'react';
import { Star, MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RideCardProps {
  ride: {
    id: string;
    from: string;
    to: string;
    date: string;
    time: string;
    price: number;
    seats: number;
    distance: string;
    driver: {
      name: string;
      avatar: string;
      rating: number;
      verified: boolean;
    };
  };
  featured?: boolean;
  className?: string;
}

export function RideCard({ ride, featured = false, className }: RideCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl transition-all duration-300 ease-apple",
        featured ? "border-2 border-primary/20" : "border border-border",
        isHovered ? "shadow-elevation transform -translate-y-1" : "shadow-subtle",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {featured && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary text-white text-xs font-medium px-3 py-1 transform rotate-45 translate-x-6 translate-y-3">
            Popular
          </div>
        </div>
      )}
      
      <div className="p-5">
        <div className="flex flex-col space-y-4">
          {/* Route */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-green-200"></div>
              <div className="w-0.5 h-10 bg-gray-200 my-1"></div>
              <div className="w-3 h-3 rounded-full bg-primary border-2 border-blue-200"></div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col space-y-3">
                <div>
                  <div className="text-sm text-gray-500">From</div>
                  <div className="font-medium">{ride.from}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">To</div>
                  <div className="font-medium">{ride.to}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Details */}
          <div className="grid grid-cols-3 gap-4 py-3 border-t border-b border-gray-100">
            <div>
              <div className="text-xs text-gray-500 mb-1">Date</div>
              <div className="text-sm font-medium flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                {ride.date}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-1">Time</div>
              <div className="text-sm font-medium">{ride.time}</div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-1">Seats</div>
              <div className="text-sm font-medium flex items-center">
                <Users className="w-3.5 h-3.5 mr-1 text-gray-400" />
                {ride.seats}
              </div>
            </div>
          </div>
          
          {/* Driver & Price */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src={ride.driver.avatar} 
                    alt={ride.driver.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {ride.driver.verified && (
                  <div className="absolute -right-0.5 -bottom-0.5 bg-green-500 text-white rounded-full p-0.5">
                    <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-sm font-medium">{ride.driver.name}</div>
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs ml-1">{ride.driver.rating} • {ride.distance}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">RM {ride.price}</div>
              <div className="text-xs text-gray-500">per seat</div>
            </div>
          </div>
          
          {/* Action Button */}
          <Button 
            className={cn(
              "w-full transition-all duration-300 ease-apple mt-2",
              isHovered ? "bg-primary" : "bg-primary/90"
            )}
          >
            Book Ride
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
