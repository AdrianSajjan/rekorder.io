export function CursorClickIcon({ height = 16, width = 16, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 16 16" {...props}>
      <path
        fill="#9797A4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m8 8 2.214 5.313.785-2.314 2.314-.785L8 8Z"
      ></path>
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m11.133 11.13 1.878 1.88"></path>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M8.998 4.47 9.383 2m2.67 3.763 1.716-1.818m-9.771 8.873L5.715 11m.005-6.186L4 3m.485 5.274L2 8"
      ></path>
    </svg>
  );
}
