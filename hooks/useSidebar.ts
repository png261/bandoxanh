import { useSidebarStore } from '@/store/sidebarStore';

export function useSidebar() {
  const { isCollapsed, setCollapsed, toggle } = useSidebarStore();

  return {
    isCollapsed,
    setCollapsed,
    toggleSidebar: toggle,
  };
}
