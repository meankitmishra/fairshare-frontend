import { useQuery } from '@tanstack/react-query';

import { apiRequest } from '@/core/api/client';

type HealthResponse = { status: string };

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiRequest<HealthResponse>('/actuator/health'),
    retry: 1,
  });
}