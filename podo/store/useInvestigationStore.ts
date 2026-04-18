import { create } from 'zustand';
import type { SourceType } from './types';

interface InvestigationState {
  // Selection
  selectedPersonId: string | null;
  selectedRecordId: string | null;

  // Filters
  searchQuery: string;
  activeSourceFilters: SourceType[];
  activeLocationFilter: string | null;

  // UI
  isDetailDrawerOpen: boolean;
  detailDrawerTarget: 'person' | 'record' | null;
  isMobileMenuOpen: boolean;

  // Sidebar
  activeSidebarTab: 'suspects' | 'timeline' | 'map';

  // Actions
  selectPerson: (id: string | null) => void;
  selectRecord: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  toggleSourceFilter: (source: SourceType) => void;
  setLocationFilter: (loc: string | null) => void;
  openDrawer: (target: 'person' | 'record') => void;
  closeDrawer: () => void;
  setSidebarTab: (tab: 'suspects' | 'timeline' | 'map') => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
}

export const useInvestigationStore = create<InvestigationState>((set) => ({
  selectedPersonId: null,
  selectedRecordId: null,
  searchQuery: '',
  activeSourceFilters: [],
  activeLocationFilter: null,
  isDetailDrawerOpen: false,
  detailDrawerTarget: null,
  activeSidebarTab: 'suspects',
  isMobileMenuOpen: false,

  selectPerson: (id) =>
    set({
      selectedPersonId: id,
      isDetailDrawerOpen: !!id,
      detailDrawerTarget: id ? 'person' : null,
    }),

  selectRecord: (id) =>
    set({
      selectedRecordId: id,
      isDetailDrawerOpen: !!id,
      detailDrawerTarget: id ? 'record' : null,
    }),

  setSearchQuery: (q) => set({ searchQuery: q }),

  toggleSourceFilter: (source) =>
    set((state) => ({
      activeSourceFilters: state.activeSourceFilters.includes(source)
        ? state.activeSourceFilters.filter((s) => s !== source)
        : [...state.activeSourceFilters, source],
    })),

  setLocationFilter: (loc) => set({ activeLocationFilter: loc }),

  openDrawer: (target) =>
    set({ isDetailDrawerOpen: true, detailDrawerTarget: target }),

  closeDrawer: () =>
    set({
      isDetailDrawerOpen: false,
      detailDrawerTarget: null,
      selectedPersonId: null,
      selectedRecordId: null,
    }),

  setSidebarTab: (tab) => set({ activeSidebarTab: tab }),

  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
}));
