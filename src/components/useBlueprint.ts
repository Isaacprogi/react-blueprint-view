import { useContext } from "react";
import { BlueprintContext } from "./BlueprintProvider";

export function useBlueprint() {
  const ctx = useContext(BlueprintContext);
  if (!ctx) {
    throw new Error("useBlueprint must be used inside BlueprintProvider");
  }
  return ctx;
}
