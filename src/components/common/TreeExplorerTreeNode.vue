<template>
  <div
    :class="[
      'tree-node',
      {
        'can-drop': canDrop,
        'tree-folder': !props.node.leaf,
        'tree-leaf': props.node.leaf
      }
    ]"
    ref="container"
  >
    <div class="node-content">
      <span class="node-label">
        <slot name="before-label" :node="props.node"></slot>
        <EditableText
          :modelValue="node.label"
          :isEditing="isEditing"
          @edit="handleRename"
        />
        <slot name="after-label" :node="props.node"></slot>
      </span>
      <Badge
        v-if="!props.node.leaf"
        :value="props.node.totalLeaves"
        severity="secondary"
        class="leaf-count-badge"
      />
    </div>
    <div class="node-actions">
      <slot name="actions" :node="props.node"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject, Ref, computed } from 'vue'
import Badge from 'primevue/badge'
import {
  dropTargetForElements,
  draggable
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import type {
  TreeExplorerDragAndDropData,
  RenderedTreeExplorerNode,
  TreeExplorerNode
} from '@/types/treeExplorerTypes'
import EditableText from '@/components/common/EditableText.vue'
import { useErrorHandling } from '@/hooks/errorHooks'

const props = defineProps<{
  node: RenderedTreeExplorerNode
}>()

const emit = defineEmits<{
  (
    e: 'itemDropped',
    node: RenderedTreeExplorerNode,
    data: RenderedTreeExplorerNode
  ): void
  (e: 'dragStart', node: RenderedTreeExplorerNode): void
  (e: 'dragEnd', node: RenderedTreeExplorerNode): void
}>()

const labelEditable = computed<boolean>(() => !!props.node.handleRename)
const renameEditingNode =
  inject<Ref<TreeExplorerNode | null>>('renameEditingNode')
const isEditing = computed(
  () => labelEditable.value && renameEditingNode.value?.key === props.node.key
)
const errorHandling = useErrorHandling()
const handleRename = errorHandling.wrapWithErrorHandlingAsync(
  async (newName: string) => {
    await props.node.handleRename(props.node, newName)
    renameEditingNode.value = null
  },
  props.node.handleError
)
const container = ref<HTMLElement | null>(null)
const canDrop = ref(false)
const treeNodeElement = ref<HTMLElement | null>(null)
let dropTargetCleanup = () => {}
let draggableCleanup = () => {}
onMounted(() => {
  treeNodeElement.value = container.value?.closest(
    '.p-tree-node-content'
  ) as HTMLElement
  if (props.node.droppable) {
    dropTargetCleanup = dropTargetForElements({
      element: treeNodeElement.value,
      onDrop: async (event) => {
        const dndData = event.source.data as TreeExplorerDragAndDropData
        if (dndData.type === 'tree-explorer-node') {
          await props.node.handleDrop?.(props.node, dndData)
          canDrop.value = false
          emit('itemDropped', props.node, dndData.data)
        }
      },
      onDragEnter: (event) => {
        const dndData = event.source.data as TreeExplorerDragAndDropData
        if (dndData.type === 'tree-explorer-node') {
          canDrop.value = true
        }
      },
      onDragLeave: () => {
        canDrop.value = false
      }
    })
  }

  if (props.node.draggable) {
    draggableCleanup = draggable({
      element: treeNodeElement.value,
      getInitialData() {
        return {
          type: 'tree-explorer-node',
          data: props.node
        }
      },
      onDragStart: () => emit('dragStart', props.node),
      onDrop: () => emit('dragEnd', props.node)
    })
  }
})
onUnmounted(() => {
  dropTargetCleanup()
  draggableCleanup()
})
</script>

<style scoped>
.tree-node {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.leaf-count-badge {
  margin-left: 0.5rem;
}
.node-content {
  display: flex;
  align-items: center;
  flex-grow: 1;
}
.leaf-label {
  margin-left: 0.5rem;
}
:deep(.editable-text span) {
  word-break: break-all;
}
</style>
