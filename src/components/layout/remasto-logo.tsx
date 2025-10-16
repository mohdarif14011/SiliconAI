
export function RemastoLogo() {
  return (
    <div className="flex items-center">
      <img 
        src="https://res.cloudinary.com/donszbe80/image/upload/v1760549926/Logo_si_ygvrru.png" 
        width="110"
        height="32"
        alt="SiliconAI Logo"
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          color: "hsl(var(--foreground))",
          fontWeight: "bold",
          fontSize: "1.5rem",
          letterSpacing: "-0.05em",
          marginLeft: "4px"
        }}
      >
        SiliconAI
      </div>
    </div>
  );
}
