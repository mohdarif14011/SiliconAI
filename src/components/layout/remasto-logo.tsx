export function RemastoLogo() {
  return (
    <svg
      width="110"
      height="32"
      viewBox="0 0 110 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <g clipPath="url(#clip0_103_2)">
        <path
          d="M0 8C0 3.58172 3.58172 0 8 0H24V32H8C3.58172 32 0 28.4183 0 24V8Z"
          fill="currentColor"
        />
        <rect x="20" width="12" height="32" fill="#1E1E1E" />
        <rect x="28" width="12" height="32" fill="currentColor" opacity="0.5" />
        <foreignObject x="38" y="0" width="72" height="32">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              color: "hsl(var(--primary))",
              fontWeight: "bold",
              fontSize: "1.5rem",
              letterSpacing: "-0.05em",
            }}
          >
            Remasto
          </div>
        </foreignObject>
      </g>
      <defs>
        <clipPath id="clip0_103_2">
          <rect width="110" height="32" rx="8" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
