"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useRouter } from "next/navigation";

export default function AddButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (path) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-4 right-4 rounded-full w-12 h-12 text-2xl">
          +
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4 mt-4">
          <Button onClick={() => handleNavigate("/expense-tracker")}>
            Add Expense
          </Button>
          <Button onClick={() => handleNavigate("/shopping-list")}>
            Add Shopping Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
