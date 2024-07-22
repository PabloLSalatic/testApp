import ExpenseTrackerSummary from "../components/ExpenseTrackerSummary";
import ShoppingListSummary from "../components/ShoppingListSummary";
import AddButton from "../components/AddButton";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Family Expense Tracker
      </h1>
      <div className="space-y-8">
        <ExpenseTrackerSummary />
        <ShoppingListSummary />
      </div>
      <AddButton />
    </main>
  );
}
