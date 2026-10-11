import api from './api';
import { Facility, LocationNode, LocationEdge, NodeType, FacilityType } from '../types';

export const facilityService = {
  getFacilities: async (): Promise<Facility[]> => {
    const res = await api.get('/facilities');
    return res.data.data;
  },

  getFacilityById: async (id: number): Promise<Facility> => {
    const res = await api.get(`/facilities/${id}`);
    return res.data.data;
  },

  getFacilityStructure: async (id: number): Promise<Facility> => {
    const res = await api.get(`/facilities/${id}/structure`);
    return res.data.data;
  },

  createFacility: async (data: {
    name: string;
    facilityType: FacilityType;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<Facility> => {
    const res = await api.post('/facilities', data);
    return res.data.data;
  },

  addNode: async (facilityId: number, data: {
    name: string;
    nodeType: NodeType;
    parentNodeId?: number | null;
    levelNumber?: number;
    latitude?: number;
    longitude?: number;
    floorPlanX?: number;
    floorPlanY?: number;
  }): Promise<LocationNode> => {
    const res = await api.post(`/facilities/${facilityId}/nodes`, data);
    return res.data.data;
  },

  updateNode: async (facilityId: number, nodeId: number, data: Partial<LocationNode>): Promise<LocationNode> => {
    const res = await api.put(`/facilities/${facilityId}/nodes/${nodeId}`, data);
    return res.data.data;
  },

  deleteNode: async (facilityId: number, nodeId: number): Promise<void> => {
    await api.delete(`/facilities/${facilityId}/nodes/${nodeId}`);
  },

  addEdge: async (facilityId: number, data: {
    sourceNodeId: number;
    destinationNodeId: number;
    distanceMeters: number;
    estimatedTimeSeconds: number;
    isAccessible: boolean;
    allowVehicles: boolean;
    isBidirectional: boolean;
  }): Promise<LocationEdge> => {
    const res = await api.post(`/facilities/${facilityId}/edges`, data);
    return res.data.data;
  },

  toggleEdgeStatus: async (facilityId: number, edgeId: number, status: string): Promise<LocationEdge> => {
    const res = await api.patch(`/facilities/${facilityId}/edges/${edgeId}/status`, { status });
    return res.data.data;
  },

  deleteEdge: async (facilityId: number, edgeId: number): Promise<void> => {
    await api.delete(`/facilities/${facilityId}/edges/${edgeId}`);
  },
};
