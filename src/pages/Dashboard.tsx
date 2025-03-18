import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Clock, Calendar, MapPin, AlertCircle, Plus, Car, Trash2, X, Loader2, User } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useRides } from "@/hooks/useRides";
import { useBookings } from "@/hooks/useBookings";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userRides, isLoadingUserRides, deleteRide } = useRides();
  const { userBookings, isLoadingUserBookings, cancelBooking } = useBookings();
  
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [confirmDeleteRide, setConfirmDeleteRide] = useState<string | null>(null);
  const [confirmCancelBooking, setConfirmCancelBooking] = useState<{
    bookingId: string;
    rideId: string;
  } | null>(null);
  
  useEffect(() => {
    // Get tab from URL query parameter
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setSelectedTab(tab);
    }
  }, [location]);
  
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    navigate(`/dashboard?tab=${value}`);
  };
  
  const handleDeleteRide = async (id: string) => {
    try {
      await deleteRide.mutateAsync(id);
      setConfirmDeleteRide(null);
    } catch (error) {
      console.error("Error deleting ride:", error);
    }
  };
  
  const handleCancelBooking = async (bookingId: string, rideId: string) => {
    try {
      await cancelBooking.mutateAsync({ bookingId, rideId });
      setConfirmCancelBooking(null);
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };
  
  // Get upcoming rides (rides in the future)
  const upcomingRides = userRides?.filter((ride) => {
    const rideDateTime = new Date(`${ride.departure_date}T${ride.departure_time}`);
    return rideDateTime > new Date();
  }) || [];
  
  // Get upcoming bookings (bookings with status pending or confirmed)
  const upcomingBookings = userBookings?.filter((booking) => {
    return booking.status !== "cancelled" && new Date(`${booking.ride.departure_date}T${booking.ride.departure_time}`) > new Date();
  }) || [];
  
  // Get counts for dashboard stats
  const totalRides = userRides?.length || 0;
  const activeRides = upcomingRides.length;
  const totalBookings = userBookings?.length || 0;
  const activeBookings = upcomingBookings.length;
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
      
      <Tabs defaultValue={selectedTab} onValueChange={handleTabChange}>
        <TabsList className="w-full justify-start mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="my-rides">My Rides</TabsTrigger>
          <TabsTrigger value="my-bookings">My Bookings</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">My Rides</CardTitle>
                <CardDescription>Rides you have offered as a driver</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalRides}</div>
                <p className="text-muted-foreground">
                  {activeRides} active rides
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate("/offer-ride")} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Offer New Ride
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">My Bookings</CardTitle>
                <CardDescription>Rides you have booked as a passenger</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalBookings}</div>
                <p className="text-muted-foreground">
                  {activeBookings} active bookings
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate("/find-rides")} className="w-full">
                  <Car className="mr-2 h-4 w-4" />
                  Find Rides
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Upcoming Rides</h2>
          {isLoadingUserRides ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcomingRides.length > 0 ? (
            <div className="space-y-4">
              {upcomingRides.slice(0, 3).map((ride) => (
                <Card key={ride.id}>
                  <CardContent className="py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="font-medium">{ride.from_location} to {ride.to_location}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {format(parseISO(ride.departure_date), "MMMM d, yyyy")}
                          <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                          {ride.departure_time}
                        </div>
                        <div className="text-sm">
                          <Badge variant="outline">{ride.available_seats} seats left</Badge>
                          <span className="ml-2 text-muted-foreground">RM {parseFloat(ride.price.toString()).toFixed(2)} per seat</span>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => navigate(`/edit-ride/${ride.id}`)}>
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {upcomingRides.length > 3 && (
                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={() => handleTabChange("my-rides")}
                  >
                    View all rides
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center mb-4">
                  You don't have any upcoming rides
                </p>
                <Button onClick={() => navigate("/offer-ride")}>Offer a Ride</Button>
              </CardContent>
            </Card>
          )}
          
          <h2 className="text-xl font-semibold mb-4 mt-8">Recent Bookings</h2>
          {isLoadingUserBookings ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.slice(0, 3).map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {booking.ride.from_location} to {booking.ride.to_location}
                          <Badge 
                            className="ml-2" 
                            variant={
                              booking.status === "confirmed" 
                                ? "success" 
                                : booking.status === "cancelled" 
                                ? "destructive" 
                                : "outline"
                            }
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {format(parseISO(booking.ride.departure_date), "MMMM d, yyyy")}
                          <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                          {booking.ride.departure_time}
                        </div>
                        <div className="text-sm flex items-center">
                          <User className="h-3.5 w-3.5 mr-1" />
                          Driver: {booking.ride.driver.first_name || 'Unknown'} {booking.ride.driver.last_name || ''}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="shrink-0"
                        onClick={() => setConfirmCancelBooking({
                          bookingId: booking.id,
                          rideId: booking.ride_id
                        })}
                        disabled={booking.status === "cancelled"}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {upcomingBookings.length > 3 && (
                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={() => handleTabChange("my-bookings")}
                  >
                    View all bookings
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center mb-4">
                  You don't have any recent bookings
                </p>
                <Button onClick={() => navigate("/find-rides")}>Find Rides</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* My Rides Tab */}
        <TabsContent value="my-rides">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Rides</h2>
            <Button onClick={() => navigate("/offer-ride")}>
              <Plus className="mr-2 h-4 w-4" />
              Offer New Ride
            </Button>
          </div>
          
          {isLoadingUserRides ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : userRides && userRides.length > 0 ? (
            <div className="space-y-4">
              {userRides.map((ride) => {
                const isPast = new Date(`${ride.departure_date}T${ride.departure_time}`) < new Date();
                
                return (
                  <Card key={ride.id} className={isPast ? "opacity-70" : ""}>
                    <CardContent className="py-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1">
                          <div className="font-medium">
                            {ride.from_location} to {ride.to_location}
                            {isPast && (
                              <Badge variant="outline" className="ml-2">Completed</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              {format(parseISO(ride.departure_date), "MMMM d, yyyy")}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {ride.departure_time}
                            </span>
                            {ride.distance && (
                              <span className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                {ride.distance}
                              </span>
                            )}
                          </div>
                          <div className="text-sm">
                            <Badge variant="outline">{ride.available_seats} seats left</Badge>
                            <span className="ml-2 text-muted-foreground">RM {parseFloat(ride.price.toString()).toFixed(2)} per seat</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => navigate(`/edit-ride/${ride.id}`)}
                            disabled={isPast}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => setConfirmDeleteRide(ride.id)}
                            disabled={isPast}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center mb-4">
                  You haven't offered any rides yet
                </p>
                <Button onClick={() => navigate("/offer-ride")}>Offer a Ride</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* My Bookings Tab */}
        <TabsContent value="my-bookings">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Bookings</h2>
            <Button onClick={() => navigate("/find-rides")}>
              <Car className="mr-2 h-4 w-4" />
              Find Rides
            </Button>
          </div>
          
          {isLoadingUserBookings ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : userBookings && userBookings.length > 0 ? (
            <div className="space-y-4">
              {userBookings.map((booking) => {
                const isPast = new Date(`${booking.ride.departure_date}T${booking.ride.departure_time}`) < new Date();
                
                return (
                  <Card key={booking.id} className={isPast ? "opacity-70" : ""}>
                    <CardContent className="py-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1">
                          <div className="font-medium">
                            {booking.ride.from_location} to {booking.ride.to_location}
                            <Badge 
                              className="ml-2" 
                              variant={
                                booking.status === "confirmed" 
                                  ? "success" 
                                  : booking.status === "cancelled" 
                                  ? "destructive" 
                                  : "outline"
                              }
                            >
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              {format(parseISO(booking.ride.departure_date), "MMMM d, yyyy")}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {booking.ride.departure_time}
                            </span>
                          </div>
                          <div className="text-sm flex items-center">
                            <Avatar className="h-5 w-5 mr-1">
                              <AvatarImage src={booking.ride.driver.avatar_url || ""} />
                              <AvatarFallback className="text-[10px]">
                                {booking.ride.driver.first_name?.[0] || "U"}
                              </AvatarFallback>
                            </Avatar>
                            Driver: {booking.ride.driver.first_name || 'Unknown'} {booking.ride.driver.last_name || ''}
                            <span className="ml-4 text-muted-foreground">RM {parseFloat(booking.ride.price.toString()).toFixed(2)}</span>
                          </div>
                        </div>
                        
                        {!isPast && booking.status !== "cancelled" && (
                          <Button 
                            variant="outline" 
                            className="shrink-0"
                            onClick={() => setConfirmCancelBooking({
                              bookingId: booking.id,
                              rideId: booking.ride.id
                            })}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center mb-4">
                  You haven't booked any rides yet
                </p>
                <Button onClick={() => navigate("/find-rides")}>Find Rides</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Confirm Delete Ride Dialog */}
      <Dialog open={!!confirmDeleteRide} onOpenChange={() => setConfirmDeleteRide(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ride</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ride? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteRide(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => confirmDeleteRide && handleDeleteRide(confirmDeleteRide)}
              disabled={deleteRide.isPending}
            >
              {deleteRide.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : "Delete Ride"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Cancel Booking Dialog */}
      <Dialog 
        open={!!confirmCancelBooking} 
        onOpenChange={() => setConfirmCancelBooking(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmCancelBooking(null)}>
              No, Keep Booking
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => confirmCancelBooking && 
                handleCancelBooking(confirmCancelBooking.bookingId, confirmCancelBooking.rideId)}
              disabled={cancelBooking.isPending}
            >
              {cancelBooking.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : "Yes, Cancel Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
