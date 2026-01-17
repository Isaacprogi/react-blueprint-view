export type Props = {
  enabled: boolean;
  toggle: () => void;
};

export function InternalToggle({ enabled, toggle }: Props) {
  return (
    <button
      data-rbv-ignore
      onClick={toggle}
      aria-label="Toggle Blueprint Mode"
      style={{
        position: "fixed",
        bottom: "16px",
        left: "16px",
        zIndex: 999999,
        padding: "10px 12px",
        borderRadius: "10px",
        border: "1px solid rgba(59,130,246,0.6)",
        background: enabled
          ? "rgba(59,130,246,0.9)"
          : "rgba(59,130,246,0.15)",
        color: enabled ? "#fff" : "#2563eb",
        fontSize: "12px",
        fontWeight: 600,
        cursor: "pointer",
        backdropFilter: "blur(6px)",
      }}
    >
      {enabled ? "RB ON" : "RB"}
    </button>
  );
}
