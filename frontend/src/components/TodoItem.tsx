import {
  Box,
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Typography,
} from "@mui/material";
import { Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Todo } from "../hooks/api";
import useTodos from "../hooks/api";
import UpdateTodoDialog from "./UpdateTodoDialog";

type Props = {
  todo: Todo;
};

export default function TodoItem({ todo }: Props) {
  const { toggleComplete, deleteTodo } = useTodos();

  const [hover, setHover] = useState(false);
  const [isUpdateTodoDialogOpen, setIsUpdateTodoDialogOpen] = useState(false);
  const [isLoadingToggle, setIsLoadingToggle] = useState(false);
  const [completed, setCompleted] = useState<boolean>(!!todo.completed);

  const handleToggleCompleted = async () => {
    setIsLoadingToggle(true);
    try {
      const updated = await toggleComplete(todo.id, !completed);
      setCompleted(!!updated.completed);
    } catch (e: any) {
      alert(
        e?.response?.data?.errors?.[0]?.message ||
          e?.message ||
          "Failed to update",
      );
    } finally {
      setIsLoadingToggle(false);
    }
  };

  const onDeleteTodo = async () => {
    if (!confirm("Delete this todo?")) return;
    try {
      await deleteTodo(todo.id);
    } catch (e: any) {
      alert(
        e?.response?.data?.errors?.[0]?.message ||
          e?.message ||
          "Delete failed",
      );
    }
  };

  return (
    <Box
      sx={{ position: "relative", mb: 2 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Card>
        <CardContent sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Checkbox
            checked={completed}
            onChange={handleToggleCompleted}
            disabled={isLoadingToggle}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5">{todo.title}</Typography>
            <Typography variant="body2" sx={{ color: "red", fontSize: 12 }}>
              {todo.responsible}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {todo.description}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {hover && (
        <>
          <IconButton
            aria-label="delete"
            size="small"
            sx={{ position: "absolute", top: 8, right: 44, color: "grey.600" }}
            onClick={onDeleteTodo}
          >
            <Trash2 size={16} />
          </IconButton>

          <IconButton
            aria-label="settings"
            size="small"
            sx={{ position: "absolute", top: 8, right: 8, color: "grey.600" }}
            onClick={() => setIsUpdateTodoDialogOpen(true)}
          >
            <Settings size={18} />
          </IconButton>
        </>
      )}

      <UpdateTodoDialog
        open={isUpdateTodoDialogOpen}
        onClose={() => setIsUpdateTodoDialogOpen(false)}
        todo={todo}
      />
    </Box>
  );
}
