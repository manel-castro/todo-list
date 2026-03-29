import { useEffect, useState } from "react";
import axios from "../services/axiosClient";
import { useTodosContext } from "../contexts/TodosContext";

export interface Todo {
  id: string;
  title: string;
  description: string;
  responsible: string;
  completed: boolean;
  [key: string]: any;
}

export function useTodos() {
  const { todos, setTodos } = useTodosContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Todo[]>("/api/todos/list");

      // sort by createdAt descending (newest first) if available
      const list = res.data || [];
      list.sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });

      setTodos(list);
      setError(null);
    } catch (e: any) {
      setError(
        e?.response?.data?.errors?.[0]?.message ||
          e?.message ||
          "Failed to load todos",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      const res = await axios.put<Todo>("/api/todos/update", { id, completed });
      setTodos((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      return res.data;
    } catch (e: any) {
      throw new Error(
        e?.response?.data?.errors?.[0]?.message ||
          e?.message ||
          "Update failed",
      );
    }
  };

  const updateTodo = async (
    id: string,
    data: { title?: string; description?: string; responsible?: string },
  ) => {
    try {
      const res = await axios.put<Todo>("/api/todos/update", { id, ...data });
      setTodos((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      return res.data;
    } catch (e: any) {
      throw new Error(
        e?.response?.data?.errors?.[0]?.message ||
          e?.message ||
          "Update failed",
      );
    }
  };

  const addTodo = async (data: {
    title: string;
    description: string;
    responsible: string;
  }) => {
    try {
      const res = await axios.post<Todo>("/api/todos/add", data);
      setTodos((prev) => [res.data, ...prev]);
      return res.data;
    } catch (e: any) {
      throw new Error(
        e?.response?.data?.errors?.[0]?.message ||
          e?.message ||
          "Create failed",
      );
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const res = await axios.delete<Todo>("/api/todos/delete", {
        data: { id },
      });
      setTodos((prev) => prev.filter((t) => t.id !== id));
      return res.data;
    } catch (e: any) {
      throw new Error(
        e?.response?.data?.errors?.[0]?.message ||
          e?.message ||
          "Delete failed",
      );
    }
  };

  return {
    todos,
    loading,
    error,
    fetchTodos,
    toggleComplete,
    updateTodo,
    addTodo,
    deleteTodo,
  };
}

export default useTodos;
