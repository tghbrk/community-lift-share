
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Calendar as CalendarIcon, Clock, MapPin, Loader2 } from "lucide-react";
import { format, parse } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useRides } from "@/hooks/useRides";
import { useToast } from "@/components/ui/use-toast";
import { Ride } from "@/types/rides";

const editRideSchema = z.object({
  from_location: z.string().min(3, { message: "Departure location is required" }),
  to_location: z.string().min(3, { message: "Destination is required" }),
  departure_date: z.date({ required_error: "Departure date is required" }),
  departure_time: z.string().min(1, { message: "Departure time is required" }),
  available_seats: z.coerce.number().min(1).max(7),
  price: z.coerce.number().min(1),
  distance: z.string().optional(),
  additional_notes: z.string().optional(),
});

type EditRideFormValues = z.infer<typeof editRideSchema>;

const EditRide = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateRide } = useRides();
  const [isLoading, setIsLoading] = useState(true);
  const [ride, setRide] = useState<Ride | null>(null);
  
  const form = useForm<EditRideFormValues>({
    resolver: zodResolver(editRideSchema),
    defaultValues: {
      from_location: "",
      to_location: "",
      available_seats: 1,
      price: 0,
      distance: "",
      additional_notes: "",
    },
  });
  
  useEffect(() => {
    const fetchRide = async () => {
      if (!id) return;
      
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
          toast({
            title: "Unauthorized",
            description: "You must be logged in to edit a ride",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }
        
        const { data, error } = await supabase
          .from('rides')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data.user_id !== user.user.id) {
          toast({
            title: "Unauthorized",
            description: "You can only edit your own rides",
            variant: "destructive",
          });
          navigate('/dashboard');
          return;
        }
        
        setRide(data);
        
        // Check if additional_notes exists in data before trying to use it
        const additionalNotes = data.additional_notes !== undefined ? data.additional_notes : "";
        
        form.reset({
          from_location: data.from_location,
          to_location: data.to_location,
          departure_date: parse(data.departure_date, 'yyyy-MM-dd', new Date()),
          departure_time: data.departure_time,
          available_seats: data.available_seats,
          price: data.price,
          distance: data.distance || "",
          additional_notes: additionalNotes,
        });
      } catch (error: any) {
        console.error("Error fetching ride:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch ride details",
          variant: "destructive",
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRide();
  }, [id, navigate, form, toast]);
  
  const onSubmit = async (data: EditRideFormValues) => {
    if (!id || !ride) return;
    
    try {
      await updateRide.mutateAsync({
        id,
        ...data,
        departure_date: format(data.departure_date, 'yyyy-MM-dd'), // Convert Date to string
      });
      navigate('/dashboard?tab=my-rides');
    } catch (error) {
      console.error("Error updating ride:", error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-3xl py-10 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Ride</CardTitle>
          <CardDescription>
            Update the details of your ride
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="from_location"
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
                  name="to_location"
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
                  name="departure_date"
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
                  name="departure_time"
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
                  name="available_seats"
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
                  name="price"
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
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 15 km" {...field} />
                    </FormControl>
                    <FormDescription>
                      Approximate distance of the ride
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="additional_notes"
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
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/dashboard?tab=my-rides')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateRide.isPending}
              >
                {updateRide.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default EditRide;
