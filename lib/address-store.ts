import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Address } from './types';
import api from './api';

interface AddressState {
  addresses: Address[];
  selectedId: number | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAddresses: () => Promise<void>;
  selectAddress: (id: number) => void;
  addAddress: (address: Address) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: number) => void;
  getSelectedAddress: () => Address | null;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],
      selectedId: null,
      isLoading: false,
      error: null,

      fetchAddresses: async () => {
        set({ isLoading: true, error: null });
        try {
          // Normalize response
          const raw = await api.addresses.getAll(); 
          // api.ts getAll returns res?.data?.addresses || res?.addresses || []
          // But purely defensive: ensure it IS an array
          const addresses = Array.isArray(raw) ? raw : [];
          
          set({ addresses, isLoading: false });
          
          // Auto-select logic if none selected
          const currentId = get().selectedId;
          const { addresses: currentAddresses } = get();
          
          if (!currentId) {
             const def = currentAddresses.find((a: Address) => a.isDefault);
             if (def) set({ selectedId: def.id });
             else if (currentAddresses.length > 0) set({ selectedId: currentAddresses[0].id });
          } else {
             // Verify current ID still exists
             if (!currentAddresses.find((a: Address) => a.id === currentId)) {
                const def = currentAddresses.find((a: Address) => a.isDefault);
                set({ selectedId: def ? def.id : (currentAddresses[0]?.id || null) });
             }
          }

        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      selectAddress: (id: number) => {
        set({ selectedId: id });
      },

      addAddress: (address: Address) => {
        set((state) => {
            const newAddresses = [...state.addresses, address];
            // If it's the first address, select it
            const newSelectedId = state.addresses.length === 0 ? address.id : state.selectedId;
            return { addresses: newAddresses, selectedId: newSelectedId };
        });
      },

      updateAddress: (address: Address) => {
        set((state) => ({
          addresses: state.addresses.map((a) => (a.id === address.id ? address : a)),
        }));
      },

      deleteAddress: (id: number) => {
        set((state) => {
            const newAddresses = state.addresses.filter((a) => a.id !== id);
            // If we deleted the selected one, reset selection
            let newSelectedId = state.selectedId;
            if (state.selectedId === id) {
                const def = newAddresses.find(a => a.isDefault);
                newSelectedId = def ? def.id : (newAddresses[0]?.id || null);
            }
            return { addresses: newAddresses, selectedId: newSelectedId };
        });
      },

      getSelectedAddress: () => {
        const { addresses, selectedId } = get();
        if (!selectedId) return null;
        return addresses.find((a) => a.id === selectedId) || null;
      },
    }),
    {
      name: 'address-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ selectedId: state.selectedId, addresses: state.addresses }), // Persist addresses too as cache
      version: 1, // Bust cache to clear bad data
    }
  )
);
