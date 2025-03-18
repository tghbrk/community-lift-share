
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Car, 
  MapPin, 
  Calendar, 
  User, 
  Clock, 
  Settings, 
  History,
  Star,
  Plus,
  AlertCircle,
  Loader2
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
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
import { useRides } from "@/hooks/useRides";
import { useBookings } from "@/hooks/useBookings";
import { format, parseISO } from "date-fns";
import { Ride, RideWithDriver } from "@/types/rides";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { 
    rides, 
    userRides, 
    isLoadingRides, 
    isLoadingUserRides, 
    deleteRide 
  } = useRides();
  const { 
    userBookings, 
    isLoadingUserBookings, 
    cancelBooking 
  } = useBookings();
  const [selectedRide, setSelectedRide] = useState<RideWithDriver | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const upcomingRides = rides?.filter(ride => 
    new Date(`${ride.departure_date}T${ride.departure_time}`) > new Date()
  ).slice(0, 4) || [];

  const userUpcomingRides = userRides?.filter(ride => 
    new Date(`${ride.departure_date}T${ride.departure_time}`) > new Date()
  ) || [];

  const handleDeleteRide = async (id: string) => {
    await deleteRide.mutateAsync(id);
    setDeleteDialogOpen(false);
  };

  const handleCancelBooking = async (bookingId: string, rideId: string) => {
    await cancelBooking.mutateAsync({ bookingId, rideId });
  };

  // Group bookings by status
  const pendingBookings = userBookings?.filter(booking => booking.status === 'pending') || [];
  const confirmedBookings = userBookings?.filter(booking => booking.status === 'confirmed') || [];
  const cancelledBookings = userBookings?.filter(booking => booking.status === 'cancelled') || [];

  // Calculate statistics
  const totalRides = userRides?.length || 0;
  const totalBookings = userBookings?.length || 0;
  
  // Estimate CO2 saved (very rough calculation assuming 120g CO2 per km per passenger)
  const totalDistance = userRides?.reduce((acc, ride) => {
    const distance = ride.distance ? parseInt(ride.distance.replace(/[^0-9]/g, '')) : 0;
    return acc + distance;
  }, 0) || 0;
  
  const co2Saved = Math.round((totalDistance * 0.12) * 10) / 10; // kg of CO2

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
                  isActive={activeTab === "my-bookings"} 
                  onClick={() => setActiveTab("my-bookings")}
                >
                  <Calendar />
                  <span>My Bookings</span>
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
                  onClick={() => navigate('/profile')}
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
                      {isLoadingUserRides ? (
                        <Skeleton className="h-8 w-24" />
                      ) : (
                        <>
                          <div className="text-2xl font-bold">{totalRides}</div>
                          <p className="text-xs text-muted-foreground">
                            {totalRides > 0 ? `Since ${format(new Date(userRides[0].created_at), 'MMM yyyy')}` : 'No rides yet'}
                          </p>
                        </>
                      )}
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
                      {isLoadingUserRides ? (
                        <Skeleton className="h-8 w-24" />
                      ) : (
                        <>
                          <div className="text-2xl font-bold">{co2Saved} kg</div>
                          <p className="text-xs text-muted-foreground">
                            By sharing your rides
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        My Bookings
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      {isLoadingUserBookings ? (
                        <Skeleton className="h-8 w-24" />
                      ) : (
                        <>
                          <div className="text-2xl font-bold">{totalBookings}</div>
                          <p className="text-xs text-muted-foreground">
                            {pendingBookings.length} pending, {confirmedBookings.length} confirmed
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Upcoming Rides</h2>
                
                {isLoadingRides ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : upcomingRides.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingRides.map((ride) => (
                      <RideCard 
                        key={ride.id} 
                        ride={{
                          id: ride.id,
                          from: ride.from_location,
                          to: ride.to_location,
                          date: ride.departure_date,
                          time: ride.departure_time,
                          price: ride.price,
                          seats: ride.available_seats,
                          distance: ride.distance || "Unknown",
                          driver: {
                            name: ride.driver.first_name || "Unknown",
                            avatar: ride.driver.avatar_url || "https://i.pravatar.cc/150?img=1",
                            rating: ride.driver.rating || 4.5,
                            verified: true
                          }
                        }} 
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <Car className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-center mb-4">
                        No upcoming rides available
                      </p>
                      <Button asChild>
                        <Link to="/find-rides">Find a Ride</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
                
                <div className="flex items-center justify-between mt-8">
                  <h2 className="text-xl font-semibold">Recent Bookings</h2>
                  {userBookings && userBookings.length > 0 && (
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("my-bookings")}>
                      View all
                    </Button>
                  )}
                </div>
                
                {isLoadingUserBookings ? (
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-4">
                            <Skeleton className="h-12 w-full" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : userBookings && userBookings.length > 0 ? (
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {userBookings.slice(0, 3).map((booking) => (
                          <div key={booking.id} className="flex items-center gap-4 p-4">
                            <div className="rounded-full bg-primary/10 p-2">
                              <Car className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium">
                                {booking.ride.from_location} to {booking.ride.to_location}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(parseISO(booking.ride.departure_date), 'MMM dd, yyyy')} at {booking.ride.departure_time}
                              </p>
                            </div>
                            <Badge variant={
                              booking.status === 'confirmed' ? 'default' : 
                              booking.status === 'pending' ? 'outline' : 'destructive'
                            }>
                              {booking.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-center mb-4">
                        You haven't booked any rides yet
                      </p>
                      <Button asChild>
                        <Link to="/find-rides">Book a Ride</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            {activeTab === "my-rides" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold tracking-tight">My Rides</h1>
                  <Button onClick={() => navigate('/offer-ride')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Offer a Ride
                  </Button>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Your Rides</CardTitle>
                    <CardDescription>Rides that you're offering to others</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingUserRides ? (
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <Skeleton key={i} className="h-24 w-full" />
                        ))}
                      </div>
                    ) : userUpcomingRides.length > 0 ? (
                      <div className="space-y-4">
                        {userUpcomingRides.map((ride) => (
                          <Card key={ride.id} className="overflow-hidden">
                            <div className="flex flex-col sm:flex-row">
                              <div className="p-4 flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold">
                                      {ride.from_location} to {ride.to_location}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {format(parseISO(ride.departure_date), 'MMM dd, yyyy')} at {ride.departure_time}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-semibold">RM {ride.price.toFixed(2)}</span>
                                    <p className="text-sm text-muted-foreground">
                                      {ride.available_seats} {ride.available_seats === 1 ? 'seat' : 'seats'} left
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-muted p-4 flex items-center justify-end gap-2 sm:w-48">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/edit-ride/${ride.id}`)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRide(ride as any);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">You're not offering any rides yet</p>
                        <Button onClick={() => navigate('/offer-ride')}>Offer a Ride</Button>
                      </div>
                    )}
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
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Available Rides</h2>
                
                {isLoadingRides ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : upcomingRides.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingRides.map((ride) => (
                      <RideCard 
                        key={ride.id} 
                        ride={{
                          id: ride.id,
                          from: ride.from_location,
                          to: ride.to_location,
                          date: ride.departure_date,
                          time: ride.departure_time,
                          price: ride.price,
                          seats: ride.available_seats,
                          distance: ride.distance || "Unknown",
                          driver: {
                            name: ride.driver.first_name || "Unknown",
                            avatar: ride.driver.avatar_url || "https://i.pravatar.cc/150?img=1",
                            rating: ride.driver.rating || 4.5,
                            verified: true
                          }
                        }} 
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-center mb-4">
                        No rides available for your search criteria
                      </p>
                      <Button onClick={() => navigate('/offer-ride')}>Offer a Ride Instead</Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            {activeTab === "my-bookings" && (
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-6">My Bookings</h1>
                
                <Tabs defaultValue="upcoming" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                  </TabsList>
                  
                  {isLoadingUserBookings ? (
                    <div className="space-y-4 mt-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))}
                    </div>
                  ) : (
                    <>
                      <TabsContent value="upcoming">
                        {pendingBookings.length > 0 || confirmedBookings.length > 0 ? (
                          <div className="space-y-4">
                            {[...pendingBookings, ...confirmedBookings]
                              .sort((a, b) => new Date(a.ride.departure_date).getTime() - new Date(b.ride.departure_date).getTime())
                              .map((booking) => (
                                <Card key={booking.id} className="overflow-hidden">
                                  <div className="flex flex-col sm:flex-row">
                                    <div className="p-4 flex-1">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">
                                              {booking.ride.from_location} to {booking.ride.to_location}
                                            </h3>
                                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>
                                              {booking.status}
                                            </Badge>
                                          </div>
                                          <p className="text-sm text-muted-foreground mt-1">
                                            {format(parseISO(booking.ride.departure_date), 'MMM dd, yyyy')} at {booking.ride.departure_time}
                                          </p>
                                          <p className="text-sm mt-2">
                                            Driver: {booking.ride.driver.first_name || 'Unknown'} {booking.ride.driver.last_name || ''}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <span className="font-semibold">RM {booking.ride.price.toFixed(2)}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-muted p-4 flex items-center justify-end gap-2 sm:w-48">
                                      <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => handleCancelBooking(booking.id, booking.ride.id)}
                                        disabled={cancelBooking.isLoading}
                                      >
                                        {cancelBooking.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cancel'}
                                      </Button>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                          </div>
                        ) : (
                          <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10">
                              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                              <p className="text-muted-foreground text-center mb-4">
                                You don't have any upcoming bookings
                              </p>
                              <Button asChild>
                                <Link to="/find-rides">Find a Ride</Link>
                              </Button>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="past">
                        <Card>
                          <CardContent className="flex flex-col items-center justify-center py-10">
                            <History className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground text-center mb-4">
                              You don't have any past bookings
                            </p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="cancelled">
                        {cancelledBookings.length > 0 ? (
                          <div className="space-y-4">
                            {cancelledBookings.map((booking) => (
                              <Card key={booking.id} className="overflow-hidden">
                                <div className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">
                                          {booking.ride.from_location} to {booking.ride.to_location}
                                        </h3>
                                        <Badge variant="destructive">
                                          {booking.status}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {format(parseISO(booking.ride.departure_date), 'MMM dd, yyyy')} at {booking.ride.departure_time}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-semibold">RM {booking.ride.price.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10">
                              <Check className="h-12 w-12 text-muted-foreground mb-4" />
                              <p className="text-muted-foreground text-center">
                                You don't have any cancelled bookings
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>
                    </>
                  )}
                </Tabs>
              </div>
            )}
            
            {/* Delete ride confirmation dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete this ride and cancel all associated bookings.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => selectedRide && handleDeleteRide(selectedRide.id)}
                    disabled={deleteRide.isLoading}
                  >
                    {deleteRide.isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
