import {
  Box,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddTodoDialog from "../components/AddTodoDialog";
import TodoItem from "../components/TodoItem";
import useTodos from "../hooks/api";

export default function Todos(): JSX.Element {
  const { todos, loading, error } = useTodos();

  const [addOpen, setAddOpen] = useState(false);

  return (
    <Container maxWidth={false} className="page-container">
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h4" gutterBottom>
          Todos
        </Typography>
        <IconButton
          color="primary"
          onClick={() => setAddOpen(true)}
          aria-label="add-todo"
          sx={{ marginBottom: 2 }}
        >
          <Plus />
        </IconButton>
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        {loading ? <CircularProgress /> : null}
      </Box>

      <Grid container direction="column">
        {todos.map((todo) => (
          <Grid item key={todo.id}>
            <TodoItem todo={todo} />
          </Grid>
        ))}
      </Grid>

      <AddTodoDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </Container>
  );
}
