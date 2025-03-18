
export type Ride = {
  id: string;
  user_id: string;
  from_location: string;
  to_location: string;
  departure_date: string;
  departure_time: string;
  price: number;
  available_seats: number;
  distance?: string;
  additional_notes?: string;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  ride_id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
};

export type RideWithDriver = Ride & {
  driver: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    rating: number | null;
  };
};
