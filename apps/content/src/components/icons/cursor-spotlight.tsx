export function CursorSpotlightIcon({ height = 16, width = 16, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" viewBox="0 0 16 16" {...props}>
      <mask id="a">
        <path fillRule="evenodd" d="M10.982 6.422a5 5 0 1 0-4.388 4.543L5.487 7.861a1.961 1.961 0 0 1 2.507-2.506l2.99 1.067Z" clipRule="evenodd" />
      </mask>
      <path fillRule="evenodd" d="M10.982 6.422a5 5 0 1 0-4.388 4.543L5.487 7.861a1.961 1.961 0 0 1 2.507-2.506l2.99 1.067Z" clipRule="evenodd" />
      <path
        d="m10.982 6.422-.672 1.884 2.449.874.216-2.591-1.993-.167Zm-4.387 4.543.235 1.986 2.492-.295-.844-2.364-1.883.673ZM5.486 7.861l-1.883.673 1.883-.673Zm.67-2.228 1.2 1.6-1.2-1.6Zm1.837-.278L7.32 7.238l.673-1.883ZM9 6c0 .087-.004.172-.01.256l3.986.333C12.992 6.394 13 6.198 13 6H9ZM6 3a3 3 0 0 1 3 3h4a7 7 0 0 0-7-7v4ZM3 6a3 3 0 0 1 3-3v-4a7 7 0 0 0-7 7h4Zm3 3a3 3 0 0 1-3-3h-4a7 7 0 0 0 7 7V9Zm.36-.021A3.05 3.05 0 0 1 6 9v4c.28 0 .557-.017.83-.049L6.36 8.98Zm-2.757-.445 1.108 3.104 3.767-1.346L7.37 7.19 3.603 8.534Zm1.353-4.501a3.961 3.961 0 0 0-1.353 4.501L7.37 7.19a.039.039 0 0 1-.014.044l-2.4-3.2Zm3.71-.562a3.961 3.961 0 0 0-3.71.562l2.4 3.2a.039.039 0 0 1-.036.005l1.346-3.767Zm2.99 1.068L8.665 3.47 7.32 7.238l2.99 1.068 1.345-3.767Z"
        mask="url(#a)"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m8 8 2.214 5.313.785-2.314 2.314-.785L8 8Zm3.133 3.13 1.878 1.88"
      />
    </svg>
  );
}
