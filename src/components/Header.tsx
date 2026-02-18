import { DollarSign, Users, Receipt } from "lucide-react";

const Header = () => {
  return (
    <header className="gradient-header text-primary-foreground shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm">
          <Receipt className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Daily Expense Split Log
          </h1>
          <p className="text-white/70 text-sm mt-0.5">
            Track shared expenses across your group
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
