import api from './api';
import { RouteCalculationResponse } from '../types';

export const routeService = {
  recommendRoute: async (data: {
    facilityId: number;
    destinationNodeId: number;
    preferredGateId?: number;
    requireAccessible?: boolean;
    isVehicle?: boolean;
  }): Promise<RouteCalculationResponse> => {
    const res = await api.post('/routes/recommend', data);
    return res.data.data;
  },

  recalculateRoute: async (deliveryId: number, requireAccessible: boolean = false): Promise<RouteCalculationResponse> => {
    const res = await api.post(`/routes/recalculate/${deliveryId}?requireAccessible=${requireAccessible}`);
    return res.data.data;
  },
};
