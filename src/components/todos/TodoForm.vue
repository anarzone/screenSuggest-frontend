<script setup>
    import {ref} from "vue";

    const props = defineProps({
        todo: {
            type: Object,
            default: null
        },
        isInline: {
            type: Boolean,
            default: false
        }
    })

    const emit = defineEmits(['add-todo', 'update-todo', 'cancel-edit']);
    const todoText = ref(props.todo ? props.todo.name : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!todoText.value.trim()) {
            return;
        }

        if (props.todo) {
            emit('update-todo', {
                ...props.todo,
                name: todoText.value,
                updated_at: new Date().toISOString()
            });
        }else{
            emit('add-todo', {
                id: Date.now(),
                name: todoText.value,
                completed: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        }

        todoText.value = '';
    }

    const handleCancel = () => {
        emit('cancel-edit');
    }
</script>

<template>
    <form @submit="handleSubmit" class="todo-form">
        <input
            v-model="todoText"
            type="text"
            :placeholder="isInline ? 'Edit todo ...' : 'Add a new todo...'"
            class="todo-input"
        />
        <div class="button-group">
            <button
                type="submit"
                class="todo-submit"
            >
                {{ todo ? 'Save' : 'Add' }}
            </button>
            <button
                v-if="isInline"
                type="button"
                class="todo-cancel"
                @click="handleCancel"
            >
                Cancel
            </button>
        </div>
    </form>

</template>

<style scoped>
.todo-form {
    width: 100%;
    max-width: 600px;
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
}

.todo-form.inline {
    margin: 0;
    flex: 1;
}

.todo-form .button-group {
    display: flex;
    gap: 0.5rem;
}

.todo-input {
    flex: 1;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.todo-input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
}

.todo-submit {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    color: white;
    background: #4CAF50;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.todo-submit:hover {
    background: #45a049;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.todo-submit:active {
    transform: translateY(0);
}

@media (max-width: 768px) {
    .todo-form {
        padding: 0 1rem;
    }

    .todo-input {
        padding: 0.6rem 0.8rem;
    }

    .todo-submit {
        padding: 0.6rem 1.2rem;
    }
}

.todo-cancel {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    color: white;
    background: #ff5252;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.todo-cancel:hover {
    background: #ff1744;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

</style>
