type Props = { className?: string };

/** Silhueta em linha do prédio da Unifran com estrela, usada como marca d'água. */
export function BuildingWatermark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.35">
        <rect x="20" y="60" width="100" height="80" />
        <rect x="30" y="20" width="30" height="40" />
        <line x1="20" y1="80" x2="120" y2="80" />
        <line x1="20" y1="100" x2="120" y2="100" />
        <line x1="20" y1="120" x2="120" y2="120" />
        <line x1="40" y1="60" x2="40" y2="140" />
        <line x1="60" y1="60" x2="60" y2="140" />
        <line x1="80" y1="60" x2="80" y2="140" />
        <line x1="100" y1="60" x2="100" y2="140" />
        <path d="M45 20 L45 5 L38 12 L52 12 L45 5" />
      </g>
    </svg>
  );
}
