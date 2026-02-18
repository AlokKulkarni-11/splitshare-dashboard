import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ExpenseForm from "@/components/ExpenseForm";
import type { Expense } from "@/pages/Index";

interface EditExpenseModalProps {
  expense: Expense;
  onClose: () => void;
  onSave: (id: string, data: Omit<Expense, "id" | "created_at">) => Promise<boolean>;
}

const EditExpenseModal = ({ expense, onClose, onSave }: EditExpenseModalProps) => {
  const handleSubmit = async (data: Omit<Expense, "id" | "created_at">) => {
    return onSave(expense.id, data);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <ExpenseForm
          onSubmit={handleSubmit}
          initialValues={{
            paid_by: expense.paid_by,
            amount: expense.amount,
            description: expense.description,
            expense_date: expense.expense_date,
          }}
          submitLabel="Save Changes"
          isCompact
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditExpenseModal;
