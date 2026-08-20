type Props = {
  className?: string;
  strokeWidth?: number;
};

/** Marca "pata + coração" usada em todas as telas, conforme os mockups em Docs/. */
export function PawHeartLogo({ className, strokeWidth = 5 }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="28" cy="24" rx="8" ry="11" stroke="currentColor" strokeWidth={strokeWidth} />
      <ellipse cx="50" cy="18" rx="8" ry="11" stroke="currentColor" strokeWidth={strokeWidth} />
      <ellipse cx="72" cy="24" rx="8" ry="11" stroke="currentColor" strokeWidth={strokeWidth} />
      <path
        d="M50 78
           C 26 62, 16 48, 16 34
           C 16 24, 24 18, 33 22
           C 41 25, 47 33, 50 40
           C 53 33, 59 25, 67 22
           C 76 18, 84 24, 84 34
           C 84 48, 74 62, 50 78 Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}
