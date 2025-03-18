
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Ride, RideWithDriver } from '@/types/rides';
import { useToast } from '@/components/ui/use-toast';

export const useRides = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch all rides
  const { data: rides, error: ridesError, isLoading: isLoadingRides } = useQuery({
    queryKey: ['rides'],
    queryFn: async (): Promise<RideWithDriver[]> => {
      // First fetch rides
      const { data: ridesData, error: ridesError } = await supabase
        .from('rides')
        .select('*')
        .order('departure_date', { ascending: true });
      
      if (ridesError) throw ridesError;
      
      // Then fetch profiles for each unique user_id
      const userIds = [...new Set(ridesData.map(ride => ride.user_id))];
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, rating')
        .in('id', userIds);
      
      if (profilesError) throw profilesError;
      
      // Create a map of user_id to profile
      const profilesMap = new Map();
      profilesData.forEach(profile => {
        profilesMap.set(profile.id, {
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url,
          rating: profile.rating
        });
      });
      
      // Combine rides with driver information
      return ridesData.map(ride => ({
        ...ride,
        driver: profilesMap.get(ride.user_id) || {
          first_name: null,
          last_name: null,
          avatar_url: null,
          rating: null
        }
      }));
    }
  });

  // Fetch user's rides
  const { data: userRides, error: userRidesError, isLoading: isLoadingUserRides } = useQuery({
    queryKey: ['userRides'],
    queryFn: async (): Promise<Ride[]> => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', user.user.id)
        .order('departure_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });
  
  // Create ride
  const createRide = useMutation({
    mutationFn: async (ride: Omit<Ride, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      setIsLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('rides')
        .insert({
          ...ride,
          user_id: user.user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      setIsLoading(false);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      queryClient.invalidateQueries({ queryKey: ['userRides'] });
      toast({
        title: "Success!",
        description: "Your ride has been created.",
      });
    },
    onError: (error) => {
      console.error('Error creating ride:', error);
      toast({
        title: "Error",
        description: "Failed to create ride. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  });
  
  // Update ride
  const updateRide = useMutation({
    mutationFn: async ({ id, ...ride }: Partial<Ride> & { id: string }) => {
      setIsLoading(true);
      
      // Format the departure_date if it's a Date object
      const formattedRide = { ...ride };
      if (ride.departure_date instanceof Date) {
        formattedRide.departure_date = ride.departure_date.toISOString().split('T')[0];
      }
      
      const { data, error } = await supabase
        .from('rides')
        .update(formattedRide)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setIsLoading(false);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      queryClient.invalidateQueries({ queryKey: ['userRides'] });
      toast({
        title: "Success!",
        description: "Your ride has been updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating ride:', error);
      toast({
        title: "Error",
        description: "Failed to update ride. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  });
  
  // Delete ride
  const deleteRide = useMutation({
    mutationFn: async (id: string) => {
      setIsLoading(true);
      const { error } = await supabase
        .from('rides')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setIsLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      queryClient.invalidateQueries({ queryKey: ['userRides'] });
      toast({
        title: "Success!",
        description: "Your ride has been deleted.",
      });
    },
    onError: (error) => {
      console.error('Error deleting ride:', error);
      toast({
        title: "Error",
        description: "Failed to delete ride. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  });
  
  return {
    rides,
    userRides,
    ridesError,
    userRidesError,
    isLoadingRides,
    isLoadingUserRides,
    isLoading,
    createRide,
    updateRide,
    deleteRide
  };
};
