export interface Itinerary {
  id: string;
  userId: number;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  destinations: Destination[];
}

export interface Destination {
  id: string;
  name: string;
  activities: Activity[];
  lat?: number;
  lng?: number;
}

export interface Activity {
  id: string;
  name: string;
  type: "landmark" | "restaurant" | "other";
  description: string;
}
