
export function PageHeader({ title }: { title: string }) {
  return (
    <div className="bg-card border-b">
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold tracking-tight py-5">{title}</h1>
        </div>
    </div>
  );
}
