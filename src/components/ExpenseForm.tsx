import { useState } from "react";
import { CalendarIcon, Loader2, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Expense } from "@/pages/Index";

interface ExpenseFormProps {
  onSubmit: (data: Omit<Expense, "id" | "created_at">) => Promise<boolean>;
  initialValues?: Omit<Expense, "id" | "created_at">;
  submitLabel?: string;
  isCompact?: boolean;
}

const defaultForm = {
  paid_by: "",
  amount: "",
  description: "",
  expense_date: "",
};

const ExpenseForm = ({
  onSubmit,
  initialValues,
  submitLabel = "Add Expense",
  isCompact = false,
}: ExpenseFormProps) => {
  const [form, setForm] = useState({
    paid_by: initialValues?.paid_by ?? "",
    amount: initialValues?.amount?.toString() ?? "",
    description: initialValues?.description ?? "",
    expense_date: initialValues?.expense_date ?? "",
  });
  const [date, setDate] = useState<Date | undefined>(
    initialValues?.expense_date ? new Date(initialValues.expense_date + "T00:00:00") : undefined
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.paid_by.trim()) e.paid_by = "Required";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    if (!form.description.trim()) e.description = "Required";
    if (!form.expense_date) e.expense_date = "Required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    const success = await onSubmit({
      paid_by: form.paid_by.trim(),
      amount: Number(form.amount),
      description: form.description.trim(),
      expense_date: form.expense_date,
    });
    setLoading(false);
    if (success && !initialValues) {
      setForm(defaultForm);
      setDate(undefined);
    }
  };

  const handleDateSelect = (d: Date | undefined) => {
    setDate(d);
    if (d) {
      setForm((prev) => ({
        ...prev,
        expense_date: format(d, "yyyy-MM-dd"),
      }));
    }
  };

  return (
    <div className={cn("bg-card rounded-2xl card-shadow border border-border", isCompact ? "p-0" : "p-6")}>
      {!isCompact && (
        <div className="mb-6">
          <h2 className="text-base font-semibold text-foreground">Add Expense</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Log a new shared expense</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="paid_by" className="text-sm font-medium">
            Paid By
          </Label>
          <Input
            id="paid_by"
            placeholder="e.g. Alice"
            value={form.paid_by}
            onChange={(e) => setForm((p) => ({ ...p, paid_by: e.target.value }))}
            className={cn("mt-1.5", errors.paid_by && "border-destructive")}
          />
          {errors.paid_by && <p className="text-xs text-destructive mt-1">{errors.paid_by}</p>}
        </div>

        <div>
          <Label htmlFor="amount" className="text-sm font-medium">
            Amount ($)
          </Label>
          <Input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
            className={cn("mt-1.5", errors.amount && "border-destructive")}
          />
          {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount}</p>}
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Input
            id="description"
            placeholder="e.g. Groceries from Whole Foods"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className={cn("mt-1.5", errors.description && "border-destructive")}
          />
          {errors.description && (
            <p className="text-xs text-destructive mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full mt-1.5 justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  errors.expense_date && "border-destructive"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          {errors.expense_date && (
            <p className="text-xs text-destructive mt-1">{errors.expense_date}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <PlusCircle className="w-4 h-4 mr-2" />
          )}
          {loading ? "Saving..." : submitLabel}
        </Button>
      </form>
    </div>
  );
};

export default ExpenseForm;
