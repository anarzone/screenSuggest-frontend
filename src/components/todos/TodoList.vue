<script setup>
import {ref, computed, onMounted} from 'vue';
import TodoItem from "@/components/todos/TodoItem.vue";

const props = defineProps({
    todos: {
        type: Array,
        required: true,
        default: () => []
    }
})

const emit = defineEmits(['update-todos'])

const sortedTodos = computed(() => {
    return [...props.todos].sort((a, b) => {
        // Sort by completion status first
        if (a.completed === b.completed) {
            // If the completion status is the same, sort by updated_at (most recent first)
            return new Date(b.updated_at) - new Date(a.updated_at);
        }
        // Put incomplete items first
        return a.completed ? 1 : -1;

    })
})

const toggleTodo = (todo) => {
    todo.completed = !todo.completed;
    todo.updated_at = new Date().toISOString();
}

const updateTodo = (todo) => {
    const newTodos = [...props.todos].map((t => t.id === todo.id ? todo : t));

    emit('update-todos', newTodos);
}
</script>

<template>
    <div class="todo-container">
        <ul class="todo-list">
            <TransitionGroup name="todo-list">
                <TodoItem
                    v-for="todo in sortedTodos"
                    :key="todo.id"
                    :todo="todo"
                    @toggle="toggleTodo(todo)"
                    @update="updateTodo"
                />
            </TransitionGroup>
        </ul>
    </div>

</template>

<style scoped>

/* Basic styling for the list */
.todo-container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
}

.todo-list {
    list-style: none;
    padding: 0;
    margin: 0;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    overflow: hidden;
}

/* Add some breathing room between list items */
:deep(.todo-item) {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

:deep(.todo-item:last-child) {
    border-bottom: none;
}

:deep(.todo-item:hover) {
    background: rgba(255, 255, 255, 0.95);
    transform: translateX(4px);
}

@media (max-width: 768px) {
    .todo-container {
        max-width: 100%;
        padding: 0 1rem;
    }

    :deep(.todo-item) {
        padding: 0.75rem 1rem;
    }
}

</style>
