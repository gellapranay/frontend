import api from './api';
import { User } from '../types';

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data.data;
  },

  registerCustomer: async (data: { name: string; email: string; phone: string; password: string }): Promise<User> => {
    const res = await api.post('/auth/register/customer', data);
    return res.data.data;
  },

  registerDeliveryPartner: async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    vehicleType: string;
    vehicleNumber?: string;
    serviceArea?: string;
  }): Promise<User> => {
    const res = await api.post('/auth/register/delivery-partner', data);
    return res.data.data;
  },

  registerFacilityAdmin: async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    organization: string;
    facilityAccessRequest?: string;
  }): Promise<User> => {
    const res = await api.post('/auth/register/facility-admin', data);
    return res.data.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await api.put('/users/profile', data);
    return res.data.data;
  },
};
