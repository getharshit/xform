// Panel Types
export interface PanelProps {
  className?: string
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export interface LeftPanelProps extends PanelProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export interface RightPanelProps extends PanelProps {
  activeTab: 'field' | 'form' | 'theme'
  onTabChange: (tab: 'field' | 'form' | 'theme') => void
}
