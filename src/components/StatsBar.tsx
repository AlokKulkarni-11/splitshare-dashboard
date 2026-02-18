import { DollarSign, Users, Receipt } from "lucide-react";

interface StatsBarProps {
  total: number;
  count: number;
  uniquePayers: string[];
}

const StatsBar = ({ total, count, uniquePayers }: StatsBarProps) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-card rounded-2xl card-shadow p-5 flex items-center gap-4 border border-border">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Spent</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(total)}</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl card-shadow p-5 flex items-center gap-4 border border-border">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10">
          <Receipt className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Entries</p>
          <p className="text-2xl font-bold text-foreground">{count}</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl card-shadow p-5 flex items-center gap-4 border border-border">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contributors</p>
          <p className="text-2xl font-bold text-foreground">{uniquePayers.length}</p>
          {uniquePayers.length > 0 && (
            <p className="text-xs text-muted-foreground truncate max-w-[140px]">
              {uniquePayers.join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
