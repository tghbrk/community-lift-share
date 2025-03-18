
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AlertCircle, Calendar as CalendarIcon, Car, Clock, Loader2, MapPin, User } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRides } from "@/hooks/useRides";
import { useBookings } from "@/hooks/useBookings";
import { RideWithDriver } from "@/types/rides";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const searchRideSchema = z.object({
  from_location: z.string().min(1, { message: "Please enter a departure location" }),
  to_location: z.string().min(1, { message: "Please enter a destination" }),
  departure_date: z.date().optional(),
});

type SearchRideFormValues = z.infer<typeof searchRideSchema>;

const FindRides = () => {
  const navigate = useNavigate();
  const { rides, isLoadingRides } = useRides();
  const { createBooking, isLoading } = useBookings();
  const [filteredRides, setFilteredRides] = useState<RideWithDriver[] | null>(null);
  const [selectedRide, setSelectedRide] = useState<RideWithDriver | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  const form = useForm<SearchRideFormValues>({
    resolver: zodResolver(searchRideSchema),
    defaultValues: {
      from_location: "",
      to_location: "",
    },
  });
  
  const onSubmit = (data: SearchRideFormValues) => {
    setSearchPerformed(true);
    
    // If no rides data available, return empty array
    if (!rides) {
      setFilteredRides([]);
      return;
    }
    
    // Filter rides based on search criteria
    let filtered = [...rides];
    
    if (data.from_location) {
      filtered = filtered.filter(ride => 
        ride.from_location.toLowerCase().includes(data.from_location.toLowerCase())
      );
    }
    
    if (data.to_location) {
      filtered = filtered.filter(ride => 
        ride.to_location.toLowerCase().includes(data.to_location.toLowerCase())
      );
    }
    
    if (data.departure_date) {
      const searchDate = format(data.departure_date, 'yyyy-MM-dd');
      filtered = filtered.filter(ride => ride.departure_date === searchDate);
    }
    
    // Only show future rides
    filtered = filtered.filter(ride => {
      const rideDateTime = new Date(`${ride.departure_date}T${ride.departure_time}`);
      return rideDateTime > new Date();
    });
    
    // Filter out rides with no seats
    filtered = filtered.filter(ride => ride.available_seats > 0);
    
    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.departure_date}T${a.departure_time}`);
      const dateB = new Date(`${b.departure_date}T${b.departure_time}`);
      return dateA.getTime() - dateB.getTime();
    });
    
    setFilteredRides(filtered);
  };
  
  const handleBookRide = async () => {
    if (!selectedRide) return;
    
    try {
      await createBooking.mutateAsync(selectedRide.id);
      setBookingDialogOpen(false);
      navigate('/dashboard?tab=my-bookings');
    } catch (error) {
      console.error("Error booking ride:", error);
    }
  };
  
  const ridesToDisplay = filteredRides || rides || [];

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Find Rides</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search for Rides</CardTitle>
          <CardDescription>Find rides from your neighborhood to your destination</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="from_location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <FormControl>
                        <div className="flex items-center rounded-md border border-input bg-background px-3 py-2">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Input 
                            placeholder="Starting point" 
                            className="border-0 bg-background p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="to_location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To</FormLabel>
                      <FormControl>
                        <div className="flex items-center rounded-md border border-input bg-background px-3 py-2">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Input 
                            placeholder="Destination" 
                            className="border-0 bg-background p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="departure_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>When</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Search Rides</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <h2 className="text-xl font-semibold mb-4">
        {searchPerformed ? 'Search Results' : 'Available Rides'}
      </h2>
      
      {isLoadingRides ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
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
      ) : (ridesToDisplay.length > 0 && (
          searchPerformed ? filteredRides && filteredRides.length > 0 : true
        )) ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {ridesToDisplay.map((ride) => (
            <Card key={ride.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {ride.driver.first_name || 'Driver'} {ride.driver.last_name || ''}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          <span>{ride.driver.rating || '4.5'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="grid grid-cols-[20px_1fr] gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{ride.from_location}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[20px_1fr] gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{ride.to_location}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{format(new Date(ride.departure_date), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{ride.departure_time}</span>
                      </div>
                      {ride.distance && (
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-1" />
                          <span>{ride.distance}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end justify-between h-full">
                    <div className="text-right mb-4">
                      <div className="text-lg font-semibold">RM {ride.price.toFixed(2)}</div>
                      <Badge variant="outline" className="mt-1">
                        {ride.available_seats} {ride.available_seats === 1 ? 'seat' : 'seats'} left
                      </Badge>
                    </div>
                    
                    <Button 
                      className="w-full md:w-auto" 
                      onClick={() => {
                        setSelectedRide(ride);
                        setBookingDialogOpen(true);
                      }}
                    >
                      Book Ride
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">
              {searchPerformed 
                ? 'No rides match your search criteria' 
                : 'No available rides at the moment'}
            </p>
            <Button onClick={() => navigate('/offer-ride')}>Offer a Ride Instead</Button>
          </CardContent>
        </Card>
      )}
      
      {/* Booking confirmation dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              You are about to book the following ride:
            </DialogDescription>
          </DialogHeader>
          
          {selectedRide && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">Route</div>
                <div>{selectedRide.from_location} to {selectedRide.to_location}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Date & Time</div>
                <div>
                  {format(new Date(selectedRide.departure_date), 'MMM dd, yyyy')} at {selectedRide.departure_time}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Driver</div>
                <div>
                  {selectedRide.driver.first_name || 'Unknown'} {selectedRide.driver.last_name || ''} 
                  {selectedRide.driver.rating && ` (${selectedRide.driver.rating}★)`}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Price</div>
                <div className="font-semibold">RM {selectedRide.price.toFixed(2)}</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBookRide}
              disabled={isLoading || createBooking.isLoading}
            >
              {(isLoading || createBooking.isLoading) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FindRides;
