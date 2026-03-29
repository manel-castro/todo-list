import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RESPONSIBLES } from "../constants";
import useTodos from "../hooks/useTodos";

export type AddTodoData = {
  title: string;
  description: string;
  responsible: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddTodoDialog({ open, onClose }: Props) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<AddTodoData>({
    mode: "onChange",
    defaultValues: { title: "", description: "", responsible: "Developer" },
  });

  const { addTodo } = useTodos();

  const [saving, setSaving] = useState(false);

  const handleCreate = async (data: AddTodoData) => {
    setSaving(true);
    try {
      await addTodo(data);
      reset();
      onClose();
    } catch (e: any) {
      alert(e?.message || "Failed to create");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Todo</DialogTitle>
      <DialogContent sx={{ width: 480 }}>
        <form id="add-todo-form" onSubmit={handleSubmit(handleCreate)}>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            {...register("title", {
              required: "Title is required.",
              minLength: { value: 3, message: "Minimum 3 characters" },
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            {...register("description", {
              required: "Description is required.",
              minLength: { value: 3, message: "Minimum 3 characters" },
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
            multiline
            rows={3}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id={`add-responsible-label`}>Responsible</InputLabel>
            <Controller
              control={control}
              name="responsible"
              rules={{ required: "Responsible is required." }}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId={`add-responsible-label`}
                  label="Responsible"
                >
                  {RESPONSIBLES.map((r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving || isSubmitting}>
          Cancel
        </Button>
        <Button
          form="add-todo-form"
          type="submit"
          variant="contained"
          disabled={saving || isSubmitting}
          startIcon={saving ? <CircularProgress size={14} /> : null}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
