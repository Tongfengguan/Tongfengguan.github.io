<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{ value: string; filename?: string; mime?: string }>(), {
  filename: 'result.txt',
  mime: 'text/plain',
})
const message = ref('')
const output = ref<HTMLTextAreaElement | null>(null)
watch(
  () => props.value,
  () => {
    message.value = ''
  }
)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.value)
    message.value = '已复制到剪贴板。'
  } catch {
    output.value?.focus()
    output.value?.select()
    message.value = '剪贴板不可用，已选中结果，请手动复制。'
  }
}

function download() {
  const url = URL.createObjectURL(new Blob([props.value], { type: `${props.mime};charset=utf-8` }))
  const link = document.createElement('a')
  link.href = url
  link.download = props.filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  message.value = '已请求下载。'
}
</script>

<template>
  <div class="tool-output">
    <div class="output-toolbar">
      <span>处理结果</span>
      <div class="tool-actions">
        <button :disabled="!value" @click="copy">复制</button
        ><button :disabled="!value" @click="download">下载</button>
      </div>
    </div>
    <textarea
      ref="output"
      :value="value"
      readonly
      aria-label="处理结果"
      placeholder="结果将显示在这里"
      spellcheck="false"
    />
    <p class="tool-feedback" role="status">{{ message }}</p>
  </div>
</template>
