export function applyBlueprint(root: HTMLElement) {
  root.classList.add("rbv-enabled");
  const elements = root.querySelectorAll<HTMLElement>("*");

  elements.forEach((el) => {
    if (el.closest("[data-rbv-ignore]")) return;

    el.classList.add("rbv-node");

    const isImage = el.tagName === "IMG" || el.tagName === "SVG";
    const hasBgImage = window.getComputedStyle(el).backgroundImage !== "none";

    if (isImage || hasBgImage) {
      el.classList.add("rbv-image");
      return;
    }

    const tag = el.tagName.toLowerCase();
    if (["button", "input", "select", "textarea", "a"].includes(tag)) {
      el.classList.add("rbv-control");
    }

    const hasDirectText = Array.from(el.childNodes).some(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== ""
    );

    if (hasDirectText) {
      el.classList.add("rbv-text");
    }
  });
}


export function clearBlueprint(root: HTMLElement) {
  root.classList.remove("rbv-enabled");
  const elements = root.querySelectorAll<HTMLElement>("*");
  elements.forEach((el) => {
    if (el.hasAttribute("data-rbv-ignore")) return;
    el.classList.remove("rbv-node", "rbv-text", "rbv-image", "rbv-control");
  });
}