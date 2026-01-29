/**
 * Premium Subscription Hook
 *
 * Provides a simple interface to check premium status and manage subscriptions.
 * Uses React Query for caching and automatic refetching.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCustomerInfo,
  getOfferings,
  purchasePackage,
  restorePurchases,
  hasEntitlement,
  isRevenueCatEnabled,
} from './revenuecatClient';
import type { PurchasesPackage } from 'react-native-purchases';

const PREMIUM_ENTITLEMENT = 'premium';

// Query keys
export const premiumKeys = {
  all: ['premium'] as const,
  status: () => [...premiumKeys.all, 'status'] as const,
  offerings: () => [...premiumKeys.all, 'offerings'] as const,
};

/**
 * Hook to check if user has premium access
 */
export function usePremiumStatus() {
  return useQuery({
    queryKey: premiumKeys.status(),
    queryFn: async () => {
      if (!isRevenueCatEnabled()) {
        return { isPremium: false, isConfigured: false };
      }

      const result = await hasEntitlement(PREMIUM_ENTITLEMENT);
      if (!result.ok) {
        return { isPremium: false, isConfigured: true, error: result.reason };
      }

      return { isPremium: result.data, isConfigured: true };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to get available subscription packages
 */
export function useOfferings() {
  return useQuery({
    queryKey: premiumKeys.offerings(),
    queryFn: async () => {
      if (!isRevenueCatEnabled()) {
        return { packages: [], isConfigured: false };
      }

      const result = await getOfferings();
      if (!result.ok) {
        return { packages: [], isConfigured: true, error: result.reason };
      }

      const packages = result.data.current?.availablePackages ?? [];
      return { packages, isConfigured: true };
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to purchase a subscription package
 */
export function usePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pkg: PurchasesPackage) => {
      const result = await purchasePackage(pkg);
      if (!result.ok) {
        throw new Error(result.reason);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate premium status to refetch
      queryClient.invalidateQueries({ queryKey: premiumKeys.status() });
    },
  });
}

/**
 * Hook to restore previous purchases
 */
export function useRestorePurchases() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await restorePurchases();
      if (!result.ok) {
        throw new Error(result.reason);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate premium status to refetch
      queryClient.invalidateQueries({ queryKey: premiumKeys.status() });
    },
  });
}

/**
 * Combined hook for all premium functionality
 */
export function usePremium() {
  const status = usePremiumStatus();
  const offerings = useOfferings();
  const purchase = usePurchase();
  const restore = useRestorePurchases();

  return {
    // Status
    isPremium: status.data?.isPremium ?? false,
    isLoading: status.isLoading,
    isConfigured: status.data?.isConfigured ?? false,

    // Offerings
    packages: offerings.data?.packages ?? [],
    isLoadingOfferings: offerings.isLoading,

    // Actions
    purchasePackage: purchase.mutateAsync,
    isPurchasing: purchase.isPending,
    purchaseError: purchase.error,

    restorePurchases: restore.mutateAsync,
    isRestoring: restore.isPending,
    restoreError: restore.error,

    // Refetch
    refetchStatus: status.refetch,
  };
}
