
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
      const { data, error } = await supabase
        .from('rides')
        .select(`
          *,
          driver:profiles(first_name, last_name, avatar_url, rating)
        `)
        .order('departure_date', { ascending: true });
      
      if (error) throw error;
      
      return data.map(ride => ({
        ...ride,
        driver: ride.driver || {
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
      const { data, error } = await supabase
        .from('rides')
        .update(ride)
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
