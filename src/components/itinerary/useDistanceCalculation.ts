import { useMemo } from 'react';
import { Destination } from '../../types/itinerary';

const useDistanceCalculation = (destinations: Destination[]) => {
  const calculateDistance = (dest1: Destination, dest2: Destination) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((dest2.lat || 0) - (dest1.lat || 0)) * Math.PI / 180;
    const dLon = ((dest2.lng || 0) - (dest1.lng || 0)) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos((dest1.lat || 0) * Math.PI / 180) * Math.cos((dest2.lat || 0) * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const totalDistance = useMemo(() => {
    let total = 0;
    for (let i = 0; i < destinations.length - 1; i++) {
      total += calculateDistance(destinations[i], destinations[i + 1]);
    }
    return total;
  }, [destinations]);

  const getDistanceBetween = (index1: number, index2: number) => {
    if (index1 < 0 || index2 < 0 || index1 >= destinations.length || index2 >= destinations.length) {
      return 0;
    }
    return calculateDistance(destinations[index1], destinations[index2]);
  };

  return {
    totalDistance,
    getDistanceBetween,
  };
};

export default useDistanceCalculation;