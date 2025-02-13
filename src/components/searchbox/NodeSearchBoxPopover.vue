<template>
  <div>
    <Dialog
      v-model:visible="visible"
      modal
      :dismissable-mask="dismissable"
      @hide="clearFilters"
      :pt="{
        root: {
          class: 'invisible-dialog-root',
          role: 'search'
        },
        mask: { class: 'node-search-box-dialog-mask' },
        transition: {
          enterFromClass: 'opacity-0 scale-75',
          // 100ms is the duration of the transition in the dialog component
          enterActiveClass: 'transition-all duration-100 ease-out',
          leaveActiveClass: 'transition-all duration-100 ease-in',
          leaveToClass: 'opacity-0 scale-75'
        }
      }"
    >
      <template #container>
        <NodeSearchBox
          :filters="nodeFilters"
          @add-filter="addFilter"
          @remove-filter="removeFilter"
          @add-node="addNode"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { app } from '@/scripts/app'
import { computed, onMounted, onUnmounted, ref, toRaw, watchEffect } from 'vue'
import NodeSearchBox from './NodeSearchBox.vue'
import Dialog from 'primevue/dialog'
import { ConnectingLink } from '@comfyorg/litegraph'
import { FilterAndValue } from '@/services/nodeSearchService'
import { ComfyNodeDefImpl, useNodeDefStore } from '@/stores/nodeDefStore'
import { ConnectingLinkImpl } from '@/types/litegraphTypes'
import { useSettingStore } from '@/stores/settingStore'
import { LinkReleaseTriggerAction } from '@/types/searchBoxTypes'
import { useCanvasStore } from '@/stores/graphStore'
import { LiteGraphCanvasEvent } from '@comfyorg/litegraph'
import { LiteGraph } from '@comfyorg/litegraph'

const settingStore = useSettingStore()

const visible = ref(false)
const dismissable = ref(true)
const triggerEvent = ref<LiteGraphCanvasEvent | null>(null)
const getNewNodeLocation = (): [number, number] => {
  if (triggerEvent.value === null) {
    return [100, 100]
  }

  const originalEvent = triggerEvent.value.detail.originalEvent
  // @ts-expect-error LiteGraph types are not typed
  return [originalEvent.canvasX, originalEvent.canvasY]
}
const nodeFilters = ref<FilterAndValue[]>([])
const addFilter = (filter: FilterAndValue) => {
  nodeFilters.value.push(filter)
}
const removeFilter = (filter: FilterAndValue) => {
  nodeFilters.value = nodeFilters.value.filter(
    (f) => toRaw(f) !== toRaw(filter)
  )
}
const clearFilters = () => {
  nodeFilters.value = []
}
const closeDialog = () => {
  visible.value = false
}

const addNode = (nodeDef: ComfyNodeDefImpl) => {
  const node = app.addNodeOnGraph(nodeDef, { pos: getNewNodeLocation() })

  const eventDetail = triggerEvent.value.detail
  if (eventDetail.subType === 'empty-release') {
    eventDetail.linkReleaseContext.links.forEach((link: ConnectingLink) => {
      ConnectingLinkImpl.createFromPlainObject(link).connectTo(node)
    })
  }

  // TODO: This is not robust timing-wise.
  // PrimeVue complains about the dialog being closed before the event selecting
  // item is fully processed.
  window.setTimeout(() => {
    closeDialog()
  }, 100)
}

const newSearchBoxEnabled = computed(
  () => settingStore.get('Comfy.NodeSearchBoxImpl') === 'default'
)
const showSearchBox = (e: LiteGraphCanvasEvent) => {
  if (newSearchBoxEnabled.value) {
    if (e.detail.originalEvent?.pointerType === 'touch') {
      setTimeout(() => {
        showNewSearchBox(e)
      }, 128)
    } else {
      showNewSearchBox(e)
    }
  } else {
    canvasStore.canvas.showSearchBox(e.detail.originalEvent as MouseEvent)
  }
}

const nodeDefStore = useNodeDefStore()
const showNewSearchBox = (e: LiteGraphCanvasEvent) => {
  if (e.detail.linkReleaseContext) {
    const links = e.detail.linkReleaseContext.links
    if (links.length === 0) {
      console.warn('Empty release with no links! This should never happen')
      return
    }
    const firstLink = ConnectingLinkImpl.createFromPlainObject(links[0])
    const filter = nodeDefStore.nodeSearchService.getFilterById(
      firstLink.releaseSlotType
    )
    const dataType = firstLink.type
    addFilter([filter, dataType])
  }

  visible.value = true
  triggerEvent.value = e

  // Prevent the dialog from being dismissed immediately
  dismissable.value = false
  setTimeout(() => {
    dismissable.value = true
  }, 300)
}

const showContextMenu = (e: LiteGraphCanvasEvent) => {
  const links = e.detail.linkReleaseContext.links
  if (links.length === 0) {
    console.warn('Empty release with no links! This should never happen')
    return
  }

  const firstLink = ConnectingLinkImpl.createFromPlainObject(links[0])
  const mouseEvent = e.detail.originalEvent as MouseEvent
  const commonOptions = {
    e: mouseEvent,
    allow_searchbox: true,
    showSearchBox: () => showSearchBox(e)
  }
  const connectionOptions = firstLink.output
    ? { nodeFrom: firstLink.node, slotFrom: firstLink.output }
    : { nodeTo: firstLink.node, slotTo: firstLink.input }
  canvasStore.canvas.showConnectionMenu({
    ...connectionOptions,
    ...commonOptions
  })
}

// Disable litegraph's default behavior of release link and search box.
const canvasStore = useCanvasStore()
watchEffect(() => {
  if (canvasStore.canvas) {
    LiteGraph.release_link_on_empty_shows_menu = false
    canvasStore.canvas.allow_searchbox = false
  }
})

const canvasEventHandler = (e: LiteGraphCanvasEvent) => {
  if (e.detail.subType === 'empty-double-click') {
    showSearchBox(e)
  } else if (e.detail.subType === 'empty-release') {
    handleCanvasEmptyRelease(e)
  } else if (e.detail.subType === 'group-double-click') {
    const group = e.detail.group
    const [x, y] = group.pos
    // @ts-expect-error LiteGraphCanvasEvent is not typed
    const relativeY = e.detail.originalEvent.canvasY - y
    // Show search box if the click is NOT on the title bar
    if (relativeY > group.titleHeight) {
      showSearchBox(e)
    }
  }
}

const linkReleaseAction = computed(() => {
  return settingStore.get('Comfy.LinkRelease.Action')
})

const linkReleaseActionShift = computed(() => {
  return settingStore.get('Comfy.LinkRelease.ActionShift')
})

const handleCanvasEmptyRelease = (e: LiteGraphCanvasEvent) => {
  const originalEvent = e.detail.originalEvent as MouseEvent
  const shiftPressed = originalEvent.shiftKey

  const action = shiftPressed
    ? linkReleaseActionShift.value
    : linkReleaseAction.value
  switch (action) {
    case LinkReleaseTriggerAction.SEARCH_BOX:
      showSearchBox(e)
      break
    case LinkReleaseTriggerAction.CONTEXT_MENU:
      showContextMenu(e)
      break
    case LinkReleaseTriggerAction.NO_ACTION:
    default:
      break
  }
}

onMounted(() => {
  document.addEventListener('litegraph:canvas', canvasEventHandler)
})

onUnmounted(() => {
  document.removeEventListener('litegraph:canvas', canvasEventHandler)
})
</script>

<style>
.invisible-dialog-root {
  width: 30%;
  min-width: 24rem;
  max-width: 48rem;
  border: 0 !important;
  background-color: transparent !important;
  margin-top: 25vh;
}

.node-search-box-dialog-mask {
  align-items: flex-start !important;
}
</style>
