import api from './api';
import { Delivery } from '../types';

export const deliveryService = {
  createDelivery: async (data: {
    facilityId: number;
    destinationNodeId: number;
    recipientName: string;
    recipientPhone: string;
    deliveryDescription?: string;
    landmark?: string;
    accessInstructions?: string;
    preferredTimeWindow?: string;
  }): Promise<Delivery> => {
    const res = await api.post('/deliveries', data);
    return res.data.data;
  },

  getMyDeliveries: async (): Promise<Delivery[]> => {
    const res = await api.get('/deliveries');
    return res.data.data;
  },

  getAvailableDeliveries: async (): Promise<Delivery[]> => {
    const res = await api.get('/deliveries/available');
    return res.data.data;
  },

  getDeliveryById: async (id: number): Promise<Delivery> => {
    const res = await api.get(`/deliveries/${id}`);
    return res.data.data;
  },

  getDeliveryByTracking: async (trackingNumber: string): Promise<Delivery> => {
    const res = await api.get(`/deliveries/tracking/${trackingNumber}`);
    return res.data.data;
  },

  acceptDelivery: async (id: number): Promise<Delivery> => {
    const res = await api.post(`/deliveries/${id}/accept`);
    return res.data.data;
  },

  startDelivery: async (id: number): Promise<Delivery> => {
    const res = await api.post(`/deliveries/${id}/start`);
    return res.data.data;
  },

  arriveDelivery: async (id: number): Promise<Delivery> => {
    const res = await api.post(`/deliveries/${id}/arrive`);
    return res.data.data;
  },

  completeDelivery: async (id: number): Promise<Delivery> => {
    const res = await api.post(`/deliveries/${id}/complete`);
    return res.data.data;
  },

  cancelDelivery: async (id: number, reason?: string): Promise<Delivery> => {
    const res = await api.post(`/deliveries/${id}/cancel`, { reason });
    return res.data.data;
  },

  submitFeedback: async (deliveryId: number, data: { rating: number; comment?: string; difficultyScore?: number; wasAccurate?: boolean }): Promise<void> => {
    await api.post(`/deliveries/${deliveryId}/feedback`, data);
  },
};
