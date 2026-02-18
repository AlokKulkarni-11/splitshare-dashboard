import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import EditExpenseModal from "@/components/EditExpenseModal";
import { toast } from "sonner";

export interface Expense {
  id: string;
  paid_by: string;
  amount: number;
  description: string;
  expense_date: string;
  created_at: string;
}

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filterPaidBy, setFilterPaidBy] = useState("");
  const [searchDescription, setSearchDescription] = useState("");

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("expense_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load expenses");
    } else {
      setExpenses(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleCreate = async (data: Omit<Expense, "id" | "created_at">) => {
    const { error } = await supabase.from("expenses").insert([data]);
    if (error) {
      toast.error("Failed to add expense");
      return false;
    }
    toast.success("Expense added successfully!");
    fetchExpenses();
    return true;
  };

  const handleUpdate = async (id: string, data: Omit<Expense, "id" | "created_at">) => {
    const { error } = await supabase.from("expenses").update(data).eq("id", id);
    if (error) {
      toast.error("Failed to update expense");
      return false;
    }
    toast.success("Expense updated successfully!");
    setEditingExpense(null);
    fetchExpenses();
    return true;
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete expense");
      return;
    }
    toast.success("Expense deleted");
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const filteredExpenses = expenses.filter((e) => {
    const matchesPaidBy = filterPaidBy
      ? e.paid_by.toLowerCase().includes(filterPaidBy.toLowerCase())
      : true;
    const matchesSearch = searchDescription
      ? e.description.toLowerCase().includes(searchDescription.toLowerCase())
      : true;
    return matchesPaidBy && matchesSearch;
  });

  const uniquePayers = Array.from(new Set(expenses.map((e) => e.paid_by)));
  const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <StatsBar
          total={totalAmount}
          count={expenses.length}
          uniquePayers={uniquePayers}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ExpenseForm onSubmit={handleCreate} />
          </div>
          <div className="lg:col-span-2">
            <ExpenseList
              expenses={filteredExpenses}
              loading={loading}
              filterPaidBy={filterPaidBy}
              searchDescription={searchDescription}
              uniquePayers={uniquePayers}
              onFilterPaidByChange={setFilterPaidBy}
              onSearchChange={setSearchDescription}
              onEdit={setEditingExpense}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </main>

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default Index;
