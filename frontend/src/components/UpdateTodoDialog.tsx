import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  Button,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import type { Todo } from "../hooks/api";
import { RESPONSIBLES } from "../config";
import useTodos from "../hooks/api";

type Props = {
  open: boolean;
  onClose: () => void;
  todo: Todo;
};

type FormValues = {
  title: string;
  description: string;
  responsible: string;
};

export default function UpdateTodoDialog({ open, onClose, todo }: Props) {
  const { updateTodo } = useTodos();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      title: todo.title,
      description: todo.description,
      responsible: todo.responsible,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: todo.title,
        description: todo.description,
        responsible: todo.responsible,
      });
    }
  }, [open, todo.title, todo.description, todo.responsible, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      await updateTodo(todo.id, {
        title: data.title,
        description: data.description,
        responsible: data.responsible,
      });
      onClose();
    } catch (e: any) {
      alert(
        e?.response?.data?.errors?.[0]?.message ||
          e?.message ||
          "Failed to save",
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Todo</DialogTitle>
      <DialogContent sx={{ width: 480 }}>
        <form
          id={`update-todo-form-${todo.id}`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            {...register("title", {
              required: "Title is required",
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
              required: "Description is required",
              minLength: { value: 3, message: "Minimum 3 characters" },
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
            multiline
            rows={3}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id={`update-responsible-label-${todo.id}`}>
              Responsible
            </InputLabel>
            <Controller
              control={control}
              name="responsible"
              rules={{ required: "Responsible is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId={`update-responsible-label-${todo.id}`}
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
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          form={`update-todo-form-${todo.id}`}
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={14} /> : null}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
