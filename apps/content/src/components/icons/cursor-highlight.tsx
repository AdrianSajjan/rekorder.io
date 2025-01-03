export function CursorHighlightIcon({ height = 16, width = 16, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 16 16" {...props}>
      <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5.321 9.942a4 4 0 1 1 4.57-4.87" />
      <path fill="#9797A4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 8 2.214 5.313.785-2.314 2.314-.785L8 8Z" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m11.133 11.13 1.878 1.88" />
    </svg>
  );
}
