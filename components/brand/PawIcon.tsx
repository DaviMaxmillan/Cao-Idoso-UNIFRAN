type Props = { className?: string };

/** Patinha sólida, usada como elemento de destaque na carteirinha. */
export function PawIcon({ className }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      fill="currentColor"
    >
      <ellipse cx="27" cy="30" rx="12" ry="16" transform="rotate(-18 27 30)" />
      <ellipse cx="50" cy="21" rx="12" ry="17" />
      <ellipse cx="73" cy="30" rx="12" ry="16" transform="rotate(18 73 30)" />
      <path
        d="M50 52
           c 12 0, 21 7, 25 15
           c 4 8, 1 17, -8 19
           c -6 1, -11 -2, -17 -2
           c -6 0, -11 3, -17 2
           c -9 -2, -12 -11, -8 -19
           c 4 -8, 13 -15, 25 -15 Z"
      />
    </svg>
  );
}
