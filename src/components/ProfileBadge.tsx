
import { Star, Shield, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileBadgeProps {
  profile: {
    name: string;
    avatar: string;
    rating: number;
    rides: number;
    verified: boolean;
    memberSince: string;
    recentRide?: string;
  };
  variant?: 'default' | 'compact';
  className?: string;
}

export function ProfileBadge({ profile, variant = 'default', className }: ProfileBadgeProps) {
  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden transition-all duration-300 ease-apple",
      variant === 'default' ? "p-5" : "p-3",
      "bg-white shadow-subtle hover:shadow-elevation border border-gray-100",
      className
    )}>
      <div className="flex items-center">
        {/* Avatar */}
        <div className="mr-4 flex-shrink-0">
          <div className={cn(
            "relative rounded-full overflow-hidden",
            variant === 'default' ? "w-16 h-16" : "w-12 h-12"
          )}>
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="w-full h-full object-cover"
            />
            
            {profile.verified && (
              <div className="absolute -right-0.5 -bottom-0.5 bg-green-500 text-white rounded-full p-0.5">
                <svg className={cn(
                  variant === 'default' ? "w-3 h-3" : "w-2 h-2"
                )} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
            )}
          </div>
        </div>
        
        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className={cn(
              "font-medium",
              variant === 'default' ? "text-base" : "text-sm"
            )}>
              {profile.name}
            </h3>
            
            {profile.verified && variant === 'default' && (
              <div className="ml-2 px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium flex items-center">
                <Shield className="w-3 h-3 mr-0.5" />
                Verified
              </div>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center mt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "fill-current",
                    i < Math.floor(profile.rating) ? "text-yellow-500" : "text-gray-200",
                    variant === 'default' ? "w-3.5 h-3.5" : "w-3 h-3"
                  )} 
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-500">({profile.rating.toFixed(1)})</span>
          </div>
          
          {variant === 'default' && (
            <>
              <div className="mt-3 flex items-center text-xs text-gray-500">
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 3.83l2.83 2.83a4 4 0 0 1 0 5.66L7.5 23.5 2 18l11.33-11.33a4 4 0 0 1 5.66 0z"/>
                    <path d="M3.5 20.5l5-5"/>
                    <path d="M14 7l3 3"/>
                  </svg>
                  {profile.rides} rides
                </span>
                <span className="mx-2">•</span>
                <span>Member since {profile.memberSince}</span>
              </div>
              
              {profile.recentRide && (
                <div className="mt-1 text-xs text-gray-500">
                  Recent: {profile.recentRide}
                </div>
              )}
            </>
          )}
        </div>
        
        {variant === 'default' && (
          <button className="ml-4 flex-shrink-0 text-gray-400 hover:text-primary transition-colors duration-200">
            <MessageCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
