<script setup>
    import TodoList from "@/components/todos/TodoList.vue";
    import TodoForm from "@/components/todos/TodoForm.vue";
    import {ref, onMounted} from "vue";

    const todos = ref([]);

    onMounted(async () => {
        try {
            const response = await fetch('/todos.json');
            const data = await response.json();
            todos.value = data.todos;
        } catch (error) {
            console.error('Error loading todos:', error);
        }
    });

    const handleAddTodo = (newTodo) => {
        todos.value = [...todos.value, newTodo];
    }

    const handleUpdateTodos = (updatedTodos) => {
        todos.value = updatedTodos;
    }
</script>

<template>
    <div class="container">
        <TodoForm @add-todo="handleAddTodo"/>
        <h1>Todo List</h1>
        <TodoList :todos="todos" @update-todos="handleUpdateTodos"/>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    box-sizing: border-box;
}

.title {
    color: #2c3e50;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }

    .title {
        font-size: 2rem;
    }
}

</style>
