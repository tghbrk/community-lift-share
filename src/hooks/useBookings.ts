
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types/rides';
import { useToast } from '@/components/ui/use-toast';

export const useBookings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch user's bookings
  const { data: userBookings, error: userBookingsError, isLoading: isLoadingUserBookings } = useQuery({
    queryKey: ['userBookings'],
    queryFn: async (): Promise<any[]> => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');
      
      // First, get the user's bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });
      
      if (bookingsError) throw bookingsError;
      
      // Then, get the ride details for each booking
      const rideIds = bookingsData.map(booking => booking.ride_id);
      
      const { data: ridesData, error: ridesError } = await supabase
        .from('rides')
        .select('*')
        .in('id', rideIds);
      
      if (ridesError) throw ridesError;
      
      // Get driver profiles
      const driverIds = ridesData.map(ride => ride.user_id);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, rating')
        .in('id', driverIds);
      
      if (profilesError) throw profilesError;
      
      // Create maps for quick lookup
      const ridesMap = new Map();
      ridesData.forEach(ride => {
        ridesMap.set(ride.id, ride);
      });
      
      const profilesMap = new Map();
      profilesData.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
      
      // Combine the data
      return bookingsData.map(booking => {
        const ride = ridesMap.get(booking.ride_id);
        const driver = ride ? profilesMap.get(ride.user_id) : null;
        
        return {
          ...booking,
          ride: {
            ...ride,
            driver: driver || {
              first_name: null,
              last_name: null,
              avatar_url: null,
              rating: null
            }
          }
        };
      });
    }
  });
  
  // Create booking
  const createBooking = useMutation({
    mutationFn: async (rideId: string) => {
      setIsLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');
      
      // First check if the user already has a booking for this ride
      const { data: existingBooking } = await supabase
        .from('bookings')
        .select('*')
        .eq('ride_id', rideId)
        .eq('user_id', user.user.id)
        .maybeSingle();
      
      if (existingBooking) {
        throw new Error('You have already booked this ride');
      }
      
      // Then check if there are available seats
      const { data: ride } = await supabase
        .from('rides')
        .select('*')
        .eq('id', rideId)
        .single();
      
      if (!ride) {
        throw new Error('Ride not found');
      }
      
      if (ride.available_seats <= 0) {
        throw new Error('No seats available');
      }
      
      // Start a transaction
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ride_id: rideId,
          user_id: user.user.id,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update available seats
      const { error: updateError } = await supabase
        .from('rides')
        .update({ available_seats: ride.available_seats - 1 })
        .eq('id', rideId);
      
      if (updateError) throw updateError;
      
      setIsLoading(false);
      return data;
    },
    onError: (error: any) => {
      console.error('Error booking ride:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to book ride. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  });
  
  // Cancel booking
  const cancelBooking = useMutation({
    mutationFn: async ({ bookingId, rideId }: { bookingId: string, rideId: string }) => {
      setIsLoading(true);
      
      // Get ride information
      const { data: ride } = await supabase
        .from('rides')
        .select('available_seats')
        .eq('id', rideId)
        .single();
      
      if (!ride) {
        throw new Error('Ride not found');
      }
      
      // Update booking status
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      // Update available seats
      const { error: updateError } = await supabase
        .from('rides')
        .update({ available_seats: ride.available_seats + 1 })
        .eq('id', rideId);
      
      if (updateError) throw updateError;
      
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  });
  
  // Update booking status (for drivers)
  const updateBookingStatus = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string, status: 'confirmed' | 'cancelled' }) => {
      setIsLoading(true);
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);
      
      if (error) throw error;
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  });
  
  return {
    userBookings,
    userBookingsError,
    isLoadingUserBookings,
    isLoading,
    createBooking,
    cancelBooking,
    updateBookingStatus
  };
};
