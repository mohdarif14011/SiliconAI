
export function RemastoLogo() {
  return (
    <div className="flex items-center">
      <img 
        src="https://res.cloudinary.com/donszbe80/image/upload/v1760549926/Logo_si_ygvrru.png" 
        width="32"
        height="32"
        alt="VLSI Interview Ace Logo"
        style={{
          borderRadius: "8px"
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          color: "hsl(var(--foreground))",
          fontWeight: "bold",
          fontSize: "1.25rem",
          letterSpacing: "-0.05em",
          marginLeft: "8px"
        }}
      >
        VLSI Interview Ace
      </div>
    </div>
  );
}
