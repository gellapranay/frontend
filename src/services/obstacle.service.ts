import api from './api';
import { Obstacle, ObstacleType } from '../types';

export const obstacleService = {
  reportObstacle: async (data: {
    facilityId: number;
    locationNodeId?: number | null;
    locationEdgeId?: number | null;
    obstacleType: ObstacleType;
    description?: string;
    severity?: string;
    durationMinutes?: number;
  }): Promise<Obstacle> => {
    const res = await api.post('/obstacles', data);
    return res.data.data;
  },

  getActiveObstacles: async (): Promise<Obstacle[]> => {
    const res = await api.get('/obstacles');
    return res.data.data;
  },

  getFacilityObstacles: async (facilityId: number): Promise<Obstacle[]> => {
    const res = await api.get(`/obstacles/facility/${facilityId}`);
    return res.data.data;
  },

  resolveObstacle: async (obstacleId: number): Promise<Obstacle> => {
    const res = await api.put(`/obstacles/${obstacleId}/resolve`);
    return res.data.data;
  },
};
