import { ref } from 'vue-demi'
import type { Ref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import { isClient } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'

export interface UseDropZoneReturn {
  isOverDropZone: Ref<boolean>
}

export function useDropZone(target: MaybeRef<HTMLElement | null>, onDrop: (files: File[] | null) => void): UseDropZoneReturn {
  const isOverDropZone = ref(false)
  let counter = 0

  if (isClient) {
    useEventListener<DragEvent>(target, 'dragenter', (event) => {
      event.preventDefault()
      counter += 1
      isOverDropZone.value = true
    })
    useEventListener<DragEvent>(target, 'dragover', (event) => {
      event.preventDefault()
    })
    useEventListener<DragEvent>(target, 'dragleave', (event) => {
      event.preventDefault()
      counter -= 1
      if (counter === 0)
        isOverDropZone.value = false
    })
    useEventListener<DragEvent>(target, 'drop', (event) => {
      event.preventDefault()
      counter = 0
      isOverDropZone.value = false
      const files = Array.from(event.dataTransfer?.files ?? [])
      if (files.length === 0) {
        onDrop(null)
        return
      }
      onDrop(files)
    })
  }

  return {
    isOverDropZone,
  }
}
