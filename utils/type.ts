export type BlueprintContextType = {
  enabled: boolean;
  toggle: () => void;
};

export type ProviderProps = {
  children: React.ReactNode;
  showToggle?: boolean;
};