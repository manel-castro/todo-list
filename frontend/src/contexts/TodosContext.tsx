import React, { createContext, useContext, useState } from "react";
import type { Todo } from "../hooks/useTodos";
import useTodos from "../hooks/useTodos";

type TodosState = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodosContext = createContext<TodosState | null>(null);

export function TodosProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <TodosContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodosContext.Provider>
  );
}

export function useTodosContext() {
  const ctx = useContext(TodosContext);
  if (!ctx) {
    throw new Error("useTodosContext must be used within a TodosProvider");
  }
  return ctx;
}

export default TodosContext;
