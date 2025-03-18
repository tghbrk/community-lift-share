
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Hero } from '@/components/Hero';
import { RideCard } from '@/components/RideCard';
import { CommunitySection } from '@/components/CommunitySection';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Calendar, ChevronRight, Shield, AlertCircle, Users } from 'lucide-react';

// Sample data for popular rides
const popularRides = [
  {
    id: '1',
    from: 'Petaling Jaya',
    to: 'KLCC, Kuala Lumpur',
    date: 'Mon, June 12',
    time: '08:30 AM',
    price: 15,
    seats: 3,
    distance: '14 km',
    driver: {
      name: 'Ahmad Ismail',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.9,
      verified: true
    }
  },
  {
    id: '2',
    from: 'Subang Jaya',
    to: 'Mid Valley Megamall',
    date: 'Tue, June 13',
    time: '09:00 AM',
    price: 12,
    seats: 2,
    distance: '10 km',
    driver: {
      name: 'Sarah Tan',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 4.7,
      verified: true
    }
  },
  {
    id: '3',
    from: 'Ampang',
    to: 'Bangsar, Kuala Lumpur',
    date: 'Wed, June 14',
    time: '08:15 AM',
    price: 18,
    seats: 4,
    distance: '16 km',
    driver: {
      name: 'Rajesh Kumar',
      avatar: 'https://randomuser.me/api/portraits/men/68.jpg',
      rating: 4.8,
      verified: true
    }
  }
];

const howItWorksSteps = [
  {
    title: 'Enter your route',
    description: "Tell us where you're going and when to find the perfect ride.",
    icon: <MapPin className="w-6 h-6" />
  },
  {
    title: 'Choose your ride',
    description: 'Browse available rides and select the one that works best for you.',
    icon: <Calendar className="w-6 h-6" />
  },
  {
    title: 'Travel together',
    description: 'Meet your driver at the pickup location and enjoy the journey.',
    icon: <Users className="w-6 h-6" />
  }
];

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen w-full transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Header />
      <Hero />
      
      {/* Popular Rides Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-blue-100 text-blue-700 rounded-full inline-flex items-center justify-center">
              Available Rides
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-4 mb-4">
              Popular Rides Today
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through some of the most popular carpooling routes in Kuala Lumpur and surrounding areas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {popularRides.map((ride, index) => (
              <RideCard 
                key={ride.id} 
                ride={ride} 
                featured={index === 0}
                className="animate-in"
                style={{ '--index': index } as React.CSSProperties}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" className="btn-hover">
              View All Available Rides
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="section bg-blue-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-blue-100 text-blue-700 rounded-full inline-flex items-center justify-center">
              Simple & Easy
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-4 mb-4">
              How JiranRide Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform connects drivers with empty seats to passengers traveling the same way.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {howItWorksSteps.map((step, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-subtle transition-all duration-300 ease-apple hover:shadow-elevation hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
                <div className="relative z-10">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center text-primary mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                <div className="absolute bottom-6 right-6 text-5xl font-display font-bold text-gray-100">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-subtle">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-display font-semibold mb-4">Ready to offer a ride?</h3>
                <p className="text-gray-600 mb-6">
                  Share your journey with others heading the same way. Reduce your travel costs, decrease traffic congestion, and make new connections.
                </p>
                <Button size="lg" className="btn-hover">
                  Offer a Ride
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="flex items-center text-lg font-medium mb-3">
                  <Shield className="w-5 h-5 mr-2 text-primary" />
                  Trust & Safety
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  We verify profiles, ratings, and provide insurance coverage for all rides booked through JiranRide.
                </p>
                <div className="flex items-start mt-4">
                  <AlertCircle className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500">
                    Always verify your driver's identity and share your trip details with trusted contacts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-blue-100 text-blue-700 rounded-full inline-flex items-center justify-center">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-4 mb-4">
              Benefits of JiranRide
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform offers numerous advantages for both riders and drivers in the community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass p-1 rounded-xl overflow-hidden shadow-elevation">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="People in car" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-display font-semibold mb-6">Making Malaysia's roads less congested, one shared ride at a time</h3>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-green-100 rounded-full p-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium mb-1">Save Money</h4>
                    <p className="text-gray-600">
                      Split travel costs and save up to RM 450 per month on your regular commute.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-green-100 rounded-full p-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium mb-1">Reduce Traffic</h4>
                    <p className="text-gray-600">
                      Each shared ride takes cars off the road, reducing congestion in urban areas.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-green-100 rounded-full p-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium mb-1">Build Community</h4>
                    <p className="text-gray-600">
                      Connect with neighbors and coworkers, forming valuable relationships.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-green-100 rounded-full p-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium mb-1">Eco-Friendly</h4>
                    <p className="text-gray-600">
                      Reduce your carbon footprint with each shared journey you take.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button className="btn-hover">
                  Learn More About Benefits
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="section bg-gradient-to-b from-white to-blue-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-blue-100 text-blue-700 rounded-full inline-flex items-center justify-center">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-4 mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real experiences from real people using JiranRide across Malaysia.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "JiranRide has transformed my daily commute! I've saved money, made friends, and reduced my carbon footprint all at once.",
                author: "Aisha Binti Mazlan",
                role: "Marketing Executive",
                location: "Petaling Jaya",
                avatar: "https://randomuser.me/api/portraits/women/33.jpg"
              },
              {
                quote: "As a driver, I can offset my fuel costs while helping others get around. The verification system makes me feel safe picking up passengers.",
                author: "Michael Tan",
                role: "Software Engineer",
                location: "Subang Jaya",
                avatar: "https://randomuser.me/api/portraits/men/41.jpg"
              },
              {
                quote: "I used to spend hours in traffic and thousands on fuel. With JiranRide, I share rides to the university and have cut my expenses in half!",
                author: "Priya Sharma",
                role: "University Student",
                location: "Bangsar",
                avatar: "https://randomuser.me/api/portraits/women/67.jpg"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-subtle border border-gray-100 transition-all duration-300 ease-apple hover:shadow-elevation"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">{testimonial.author}</h4>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}, {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Ready to start your journey with JiranRide?
              </h2>
              <p className="text-blue-100 mb-8 text-lg">
                Join thousands of Malaysians already saving money, reducing traffic, and building communities through carpooling.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg" className="bg-white text-primary hover:bg-blue-50 btn-hover">
                  Download App
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-500 btn-hover">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                <div className="relative glass rounded-xl overflow-hidden border border-white/20 shadow-elevation">
                  <div className="p-1">
                    <div className="rounded-lg overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=3074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        alt="Mobile app" 
                        className="w-full aspect-[4/3] object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-white/20 backdrop-blur-sm p-4 border border-white/40">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Community Section */}
      <CommunitySection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
