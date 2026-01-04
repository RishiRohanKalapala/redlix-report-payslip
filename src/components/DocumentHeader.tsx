interface DocumentHeaderProps {
  title: string;
  subtitle?: string;
}

export function DocumentHeader({ title, subtitle }: DocumentHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b pb-6 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-2xl">R</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Redlix</h1>
          <p className="text-sm text-muted-foreground">Professional Document Solutions</p>
        </div>
      </div>
      <div className="text-right">
        <h2 className="text-2xl font-bold text-primary">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}
