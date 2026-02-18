import { useState } from "react";
import { Pencil, Trash2, AlertCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { Expense } from "@/pages/Index";

interface ExpenseListProps {
  expenses: Expense[];
  loading: boolean;
  filterPaidBy: string;
  searchDescription: string;
  uniquePayers: string[];
  onFilterPaidByChange: (v: string) => void;
  onSearchChange: (v: string) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => Promise<void>;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const formatDate = (dateStr: string) => {
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
];

const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

const ExpenseList = ({
  expenses,
  loading,
  filterPaidBy,
  searchDescription,
  uniquePayers,
  onFilterPaidByChange,
  onSearchChange,
  onEdit,
  onDelete,
}: ExpenseListProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await onDelete(deleteId);
    setDeleting(false);
    setDeleteId(null);
  };

  return (
    <>
      <div className="bg-card rounded-2xl card-shadow border border-border p-6 flex flex-col gap-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search description..."
              value={searchDescription}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
          <Select
            value={filterPaidBy || "__all__"}
            onValueChange={(v) => onFilterPaidByChange(v === "__all__" ? "" : v)}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All contributors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All contributors</SelectItem>
              {uniquePayers.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Expense Log</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {expenses.length} {expenses.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading expenses...</span>
          </div>
        ) : expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <AlertCircle className="w-10 h-10 opacity-30" />
            <p className="text-sm font-medium">No expenses found</p>
            <p className="text-xs opacity-70">
              {filterPaidBy || searchDescription
                ? "Try adjusting your filters"
                : "Add your first expense using the form"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[540px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide pb-3 px-2">
                    Paid By
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide pb-3 px-2">
                    Description
                  </th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide pb-3 px-2">
                    Amount
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide pb-3 px-2">
                    Date
                  </th>
                  <th className="pb-3 px-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="group hover:bg-muted/40 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold shrink-0",
                            getAvatarColor(expense.paid_by)
                          )}
                        >
                          {expense.paid_by.charAt(0).toUpperCase()}
                        </span>
                        <span className="font-medium text-foreground truncate max-w-[90px]">
                          {expense.paid_by}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground max-w-[160px]">
                      <span className="truncate block" title={expense.description}>
                        {expense.description}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-foreground">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground whitespace-nowrap">
                      {formatDate(expense.expense_date)}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-7 h-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => onEdit(expense)}
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteId(expense.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ExpenseList;
