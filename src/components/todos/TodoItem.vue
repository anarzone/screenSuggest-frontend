<script setup>
import {ref, computed} from 'vue';

import TodoForm from "@/components/todos/TodoForm.vue";

const props = defineProps({
    todo: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['toggle', 'update'])
const isEditing = ref(false);

const startEditing = () => {
    if (!props.todo.completed) {
        isEditing.value = true;
    }
}

const handleUpdate = (updatedTodo) => {
    isEditing.value = false;
    emit('update', updatedTodo);
}

</script>

<template>
    <li class="todo-item" :class="{ 'todo-completed': todo.completed }">
        <template v-if="!isEditing">
            <label class="checkbox-container">
                <input type="checkbox"
                       :checked="todo.completed"
                       class="checkbox-input"
                       @change="$emit('toggle')"
                />
                <span class="checkbox-custom"></span>
            </label>
            <span
                class="todo-text"
                :class="{ completed: todo.completed }"
                @click="startEditing"
            >
                {{ todo.name }}
            </span>
        </template>
        <template v-else>
            <TodoForm
                :todo="todo"
                :isInline="true"
                @update-todo="handleUpdate"
                @cancel-edit="isEditing = false"
            />
        </template>
    </li>
</template>

<style scoped>
.todo-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
}

.checkbox-container {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    user-select: none;
}

.checkbox-input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkbox-custom {
    position: relative;
    height: 20px;
    width: 20px;
    background-color: #fff;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.checkbox-input:checked ~ .checkbox-custom {
    background-color: #4CAF50;
    border-color: #4CAF50;
}

.checkbox-custom::after {
    content: '';
    position: absolute;
    display: none;
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.checkbox-input:checked ~ .checkbox-custom::after {
    display: block;
}

.checkbox-container:hover .checkbox-custom {
    border-color: #4CAF50;
}

.todo-text {
    font-size: 1rem;
    color: #2c3e50;
    transition: all 0.3s ease;
    flex-grow: 1;
    cursor: pointer;
}

.todo-text.completed {
    color: #a0a0a0;
    text-decoration: line-through;
    font-style: italic;
}

.todo-text:hover:not(.completed) {
    color: #4CAF50;
}

/* Hover effect */
.todo-item:hover .todo-text:not(.completed) {
    color: #000;
}

/* Focus styles for accessibility */
.checkbox-input:focus ~ .checkbox-custom {
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

@media (max-width: 768px) {
    .checkbox-custom {
        height: 18px;
        width: 18px;
    }

    .checkbox-custom::after {
        left: 5px;
        top: 2px;
        width: 4px;
        height: 8px;
    }

    .todo-text {
        font-size: 0.95rem;
    }
}
</style>