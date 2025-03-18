
import { useState } from "react";
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
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";

const offerRideSchema = z.object({
  departureLocation: z.string().min(3, { message: "Departure location is required" }),
  destination: z.string().min(3, { message: "Destination is required" }),
  departureDate: z.date({ required_error: "Departure date is required" }),
  departureTime: z.string().min(1, { message: "Departure time is required" }),
  availableSeats: z.coerce.number().min(1).max(7),
  pricePerSeat: z.coerce.number().min(1),
  additionalNotes: z.string().optional(),
});

type OfferRideFormValues = z.infer<typeof offerRideSchema>;

const OfferRide = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<OfferRideFormValues>({
    resolver: zodResolver(offerRideSchema),
    defaultValues: {
      departureLocation: "",
      destination: "",
      availableSeats: 1,
      pricePerSeat: 0,
      additionalNotes: "",
    },
  });
  
  const onSubmit = async (data: OfferRideFormValues) => {
    setIsSubmitting(true);
    
    try {
      // This would be replaced with the actual API call to save the ride
      console.log("Form data submitted:", data);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: "Your ride has been created. Passengers can now book it.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was an error creating your ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Offer a Ride</CardTitle>
          <CardDescription>
            Share your journey and help your community while saving on travel costs
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="departureLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Location</FormLabel>
                      <FormControl>
                        <div className="flex items-center rounded-md border border-input bg-background px-3 py-2">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Input 
                            placeholder="e.g. Damansara" 
                            className="border-0 bg-background p-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <div className="flex items-center rounded-md border border-input bg-background px-3 py-2">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Input 
                            placeholder="e.g. Kuala Lumpur" 
                            className="border-0 bg-background p-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="departureDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Departure Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
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
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="departureTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Time</FormLabel>
                      <FormControl>
                        <div className="flex items-center rounded-md border border-input bg-background px-3 py-2">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Input 
                            type="time" 
                            className="border-0 bg-background p-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="availableSeats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Seats</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={7} {...field} />
                      </FormControl>
                      <FormDescription>
                        Maximum 7 seats
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pricePerSeat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Seat (RM)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={0.50} {...field} />
                      </FormControl>
                      <FormDescription>
                        Suggested: RM 0.50-1.00 per km
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <textarea 
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                        placeholder="Any special instructions or information about the ride..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Add any details that might be helpful for riders
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating Ride..." : "Create Ride"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default OfferRide;
