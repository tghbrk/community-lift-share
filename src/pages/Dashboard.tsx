
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Car, 
  MapPin, 
  Calendar, 
  User, 
  Clock, 
  Settings, 
  History,
  Star 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { RideCard } from "@/components/RideCard";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Mock data for the dashboard
const upcomingRides = [
  {
    id: "ride-123",
    from: "Damansara",
    to: "Kuala Lumpur",
    date: "2023-08-22",
    time: "08:00 AM",
    price: 15,
    seats: 3,
    distance: "15 km",
    driver: {
      name: "Ahmad",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 4.8,
      verified: true
    }
  },
  {
    id: "ride-124",
    from: "Shah Alam",
    to: "Petaling Jaya",
    date: "2023-08-23",
    time: "10:30 AM",
    price: 12,
    seats: 2,
    distance: "12 km",
    driver: {
      name: "Sarah",
      avatar: "https://i.pravatar.cc/150?img=5",
      rating: 4.6,
      verified: true
    }
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center px-2">
              <div className="flex items-center gap-2 font-semibold text-xl text-primary">
                <Car className="h-6 w-6" />
                <span>JiranRide</span>
              </div>
              <div className="flex-1" />
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === "overview"} 
                  onClick={() => setActiveTab("overview")}
                >
                  <LayoutDashboard />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === "my-rides"} 
                  onClick={() => setActiveTab("my-rides")}
                >
                  <Car />
                  <span>My Rides</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === "find-rides"} 
                  onClick={() => setActiveTab("find-rides")}
                >
                  <MapPin />
                  <span>Find Rides</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === "schedule"} 
                  onClick={() => setActiveTab("schedule")}
                >
                  <Calendar />
                  <span>Schedule</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === "history"} 
                  onClick={() => setActiveTab("history")}
                >
                  <History />
                  <span>Ride History</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === "profile"} 
                  onClick={() => setActiveTab("profile")}
                >
                  <User />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === "settings"} 
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="p-4">
              <Link to="/profile">
                <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{user?.email || "User"}</p>
                    <p className="text-muted-foreground text-xs">View profile</p>
                  </div>
                </div>
              </Link>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="bg-muted/50">
          <div className="container p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back! Here's what's happening with your rides.
                </p>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Rides
                      </CardTitle>
                      <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24</div>
                      <p className="text-xs text-muted-foreground">
                        +5 from last month
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        CO2 Saved
                      </CardTitle>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">120 kg</div>
                      <p className="text-xs text-muted-foreground">
                        +15 kg from last month
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Rating
                      </CardTitle>
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4.8</div>
                      <p className="text-xs text-muted-foreground">
                        Based on 15 reviews
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Upcoming Rides</h2>
                
                {upcomingRides.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingRides.map((ride) => (
                      <RideCard key={ride.id} ride={ride} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <Car className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-center mb-4">
                        You don't have any upcoming rides
                      </p>
                      <Button asChild>
                        <Link to="/find-rides">Find a Ride</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
                
                <div className="flex items-center justify-between mt-8">
                  <h2 className="text-xl font-semibold">Recent Activity</h2>
                  <Button variant="outline" size="sm">View all</Button>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      <div className="flex items-center gap-4 p-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Car className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Ride to Kuala Lumpur</p>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                        <div className="font-medium">RM 15</div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Star className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Received 5-star rating</p>
                          <p className="text-xs text-muted-foreground">1 week ago</p>
                        </div>
                        <div className="font-medium">⭐⭐⭐⭐⭐</div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Updated profile</p>
                          <p className="text-xs text-muted-foreground">2 weeks ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === "my-rides" && (
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-6">My Rides</h1>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Rides</CardTitle>
                    <CardDescription>Rides that you're offering to others</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10">
                      <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">You're not offering any rides yet</p>
                      <Button>Offer a Ride</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === "find-rides" && (
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-6">Find Rides</h1>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Search for Rides</CardTitle>
                    <CardDescription>Find rides from your neighborhood to your destination</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">From</label>
                        <div className="flex items-center rounded-md border border-input bg-background px-3 py-2">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <input 
                            placeholder="Starting point" 
                            className="flex-1 bg-transparent outline-none"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">To</label>
                        <div className="flex items-center rounded-md border border-input bg-background px-3 py-2">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <input 
                            placeholder="Destination" 
                            className="flex-1 bg-transparent outline-none"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">When</label>
                        <div className="flex items-center rounded-md border border-input bg-background px-3 py-2">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <input 
                            type="date" 
                            className="flex-1 bg-transparent outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4">Search Rides</Button>
                  </CardContent>
                </Card>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Popular Rides</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingRides.map((ride) => (
                    <RideCard key={ride.id} ride={ride} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Other tabs content would be added here */}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
