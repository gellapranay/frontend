import api from './api';
import { AnalyticsOverview } from '../types';

export const analyticsService = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    const res = await api.get('/analytics/overview');
    return res.data.data;
  },

  getAuditEvents: async (): Promise<any[]> => {
    const res = await api.get('/analytics/audit-events');
    return res.data.data;
  },
};
