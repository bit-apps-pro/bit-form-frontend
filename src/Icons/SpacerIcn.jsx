export default function SpacerIcn({ size = '14px', strokeWidth = 0 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    >
      <path d="M5 5v4h14V5h-2v2H7V5zM5 19v-4h14v4h-2v-2H7v2zM7 11h10v2H7z" />
    </svg>
  )
}
