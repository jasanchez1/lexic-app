<template>
  <div class="flex items-center space-x-2">
    <button 
      v-if="canEdit"
      @click="$emit('edit')"
      class="text-primary-600 hover:text-primary-700 text-sm flex items-center"
      title="Editar reseña"
    >
      <Edit class="w-4 h-4 mr-1" />
      <span class="hidden sm:inline">Editar</span>
    </button>
    
    <button 
      v-if="canEdit"
      @click="confirmDelete"
      class="text-red-600 hover:text-red-700 text-sm flex items-center"
      title="Eliminar reseña"
    >
      <Trash2 class="w-4 h-4 mr-1" />
      <span class="hidden sm:inline">Eliminar</span>
    </button>
    
    <!-- Delete confirmation modal -->
    <div 
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h3 class="text-lg font-bold mb-3">¿Eliminar reseña?</h3>
        <p class="text-gray-600 mb-6">Esta acción no se puede deshacer. ¿Estás seguro que deseas eliminar tu reseña?</p>
        
        <div class="flex gap-3">
          <button 
            @click="showDeleteConfirm = false"
            class="flex-1 bg-gray-100 text-gray-700 p-2 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          
          <button 
            @click="handleDelete"
            class="flex-1 bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
            :disabled="isDeleting"
          >
            {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Edit, Trash2 } from 'lucide-vue-next'

defineProps<{
  canEdit: boolean
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()

const showDeleteConfirm = ref(false)
const isDeleting = ref(false)

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  isDeleting.value = true
  emit('delete')
  showDeleteConfirm.value = false
  isDeleting.value = false
}
</script>