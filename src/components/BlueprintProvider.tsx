import { createContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { applyBlueprint, clearBlueprint } from "./blueprint";
import { startObserver, stopObserver } from "./observer";
import { InternalToggle } from "./InternalToggle";
import "../index.css";
import type { ProviderProps, BlueprintContextType } from "../../utils/type";

export const BlueprintContext = createContext<BlueprintContextType | null>(
  null
);

const STORAGE_KEY = "rbv-enabled";

export function BlueprintProvider({
  children,
  showToggle = true,
}: ProviderProps) {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;

    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  const toggle = () => setEnabled((v) => !v);


  useEffect(() => {
    if (typeof document === "undefined") return;

    if (enabled) {
      document.body.classList.add("rbv-enabled");
      applyBlueprint(document.body);
      startObserver();
    } else {
      document.body.classList.remove("rbv-enabled");
      clearBlueprint(document.body);
      stopObserver();
    }
  }, [enabled]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(STORAGE_KEY, String(enabled));
  }, [enabled]);

  return (
    <BlueprintContext.Provider value={{ enabled, toggle }}>
      {children}

      {showToggle &&
        typeof document !== "undefined" &&
        createPortal(
          <InternalToggle enabled={enabled} toggle={toggle} />,
          document.body
        )}
    </BlueprintContext.Provider>
  );
}
