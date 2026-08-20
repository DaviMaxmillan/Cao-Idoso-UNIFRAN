type Props = { className?: string };

/** Padrão de pontinhos decorativo do canto superior direito nos mockups. */
export function DotPattern({ className }: Props) {
  const dots = [];
  const cols = 6;
  const rows = 6;
  const spacing = 12;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      dots.push(
        <circle
          key={`${row}-${col}`}
          cx={col * spacing + 4}
          cy={row * spacing + 4}
          r="2"
          fill="currentColor"
        />
      );
    }
  }
  return (
    <svg
      viewBox={`0 0 ${cols * 12} ${rows * 12}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {dots}
    </svg>
  );
}
