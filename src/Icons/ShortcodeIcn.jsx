export default function ShortcodeIcn({ size, stroke = 2 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20">
      <path
        strokeWidth={20}
        fill="currentColor"
        d="M6 14H4V6h2V4H2v12h4zm1.1 3h2.1l3.7-14h-2.1zM14 4v2h2v8h-2v2h4V4z"
      />
    </svg>
  )
}
