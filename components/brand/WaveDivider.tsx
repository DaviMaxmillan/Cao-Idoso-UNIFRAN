type Props = { className?: string };

/** Transição curva entre o topo branco e a seção azul, como nos mockups. */
export function WaveDivider({ className }: Props) {
  return (
    <svg
      viewBox="0 0 500 80"
      preserveAspectRatio="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0,0 C125,0 175,80 250,80 C325,80 375,0 500,0 L500,80 L0,80 Z"
        fill="var(--brand-blue-deep)"
      />
    </svg>
  );
}
