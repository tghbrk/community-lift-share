
import { MessageCircle, Calendar, Users, ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileBadge } from './ProfileBadge';
import { cn } from '@/lib/utils';

const featuredProfiles = [
  {
    name: "Ahmad Ismail",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.9,
    rides: 152,
    verified: true,
    memberSince: "Jun 2022",
    recentRide: "KL Sentral → Subang Jaya"
  },
  {
    name: "Sarah Tan",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.7,
    rides: 98,
    verified: true,
    memberSince: "Aug 2022"
  },
  {
    name: "Rajesh Kumar",
    avatar: "https://randomuser.me/api/portraits/men/68.jpg",
    rating: 4.8,
    rides: 203,
    verified: true,
    memberSince: "Mar 2022"
  }
];

const communityEvents = [
  {
    title: "KL Eco-Commuters Meetup",
    date: "Jun 15, 2023",
    time: "6:30 PM",
    location: "KLCC Park",
    attendees: 34,
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFya3xlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    title: "Sustainable Transport Forum",
    date: "Jul 8, 2023",
    time: "10:00 AM",
    location: "Malaysia Convention Centre",
    attendees: 127,
    image: "https://images.unsplash.com/photo-1475721027785-f74ec9c7e14c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNvbmZlcmVuY2V8ZW58MHx8MHx8fDA%3D"
  }
];

const communityPosts = [
  {
    author: {
      name: "Lina Abdullah",
      avatar: "https://randomuser.me/api/portraits/women/79.jpg"
    },
    content: "Has anyone been carpooling to Cyberjaya from Ampang? Looking for regulars to share rides with!",
    timestamp: "2 hours ago",
    likes: 12,
    comments: 8
  },
  {
    author: {
      name: "David Wong",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg"
    },
    content: "Just saved RM350 this month by carpooling to work! The app makes it so easy to find reliable rides.",
    timestamp: "5 hours ago",
    likes: 45,
    comments: 13
  }
];

export function CommunitySection() {
  return (
    <section className="section bg-gradient-to-b from-white to-blue-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Join Our Growing Community</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with fellow commuters, attend local events, and be part of the movement towards sustainable transportation in Malaysia.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Community Posts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-display font-semibold">Community Discussions</h3>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            {communityPosts.map((post, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-subtle border border-gray-100 p-5 transition-all duration-300 ease-apple hover:shadow-elevation"
              >
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{post.author.name}</h4>
                      <span className="text-xs text-gray-500">{post.timestamp}</span>
                    </div>
                    <p className="mt-2 text-gray-700">{post.content}</p>
                    <div className="mt-4 flex items-center space-x-4">
                      <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span className="text-xs">{post.likes}</span>
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">{post.comments}</span>
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                          <polyline points="16 6 12 2 8 6"></polyline>
                          <line x1="12" y1="2" x2="12" y2="15"></line>
                        </svg>
                        <span className="text-xs">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Events */}
            <div className="mt-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display font-semibold">Upcoming Events</h3>
                <Button variant="ghost" size="sm" className="text-primary">
                  All Events
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {communityEvents.map((event, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-xl shadow-subtle border border-gray-100 overflow-hidden transition-all duration-300 ease-apple hover:shadow-elevation"
                  >
                    <div className="h-36 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-2">{event.title}</h4>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        {event.date} • {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.location}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          {event.attendees} attending
                        </div>
                        <Button size="sm" variant="outline">
                          Join
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Featured Profiles */}
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-display font-semibold">Featured Drivers</h3>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            {featuredProfiles.map((profile, index) => (
              <ProfileBadge key={index} profile={profile} />
            ))}
            
            {/* Community Stats */}
            <div className="bg-white rounded-xl shadow-subtle border border-gray-100 p-5 mt-8">
              <h3 className="text-lg font-display font-semibold mb-4">Community Impact</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">CO₂ Reduced</span>
                    <span className="text-sm text-gray-500">45,230 kg</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '70%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Cars off Road</span>
                    <span className="text-sm text-gray-500">3,240</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Money Saved</span>
                    <span className="text-sm text-gray-500">RM 823,560</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button className="w-full" variant="outline">
                  Join Our Community
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
