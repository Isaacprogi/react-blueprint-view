import { applyBlueprint } from "./blueprint";

let observer: MutationObserver | null = null;

export function startObserver() {
  if (observer) return;

  observer = new MutationObserver(() => {
    applyBlueprint(document.body);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export function stopObserver() {
  observer?.disconnect();
  observer = null;
}
