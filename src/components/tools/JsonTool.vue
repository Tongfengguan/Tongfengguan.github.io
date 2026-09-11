<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { convertText, MAX_TEXT_SIZE, type Conversion } from '../../utils/toolbox'
import ToolOutput from './ToolOutput.vue'

const source = ref('')
const operation = ref<Conversion>('format')
const result = ref('')
const error = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const filename = computed(() =>
  operation.value === 'json-csv' ? 'converted.csv' : 'converted.json'
)
let importVersion = 0
watch(
  [source, operation],
  () => {
    result.value = ''
    error.value = ''
    importVersion++
  },
  { flush: 'sync' }
)

function convert() {
  try {
    result.value = convertText(source.value, operation.value)
    error.value = ''
  } catch (failure) {
    result.value = ''
    error.value = failure instanceof Error ? failure.message : '转换失败。'
  }
}

async function importFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  result.value = ''
  error.value = ''
  const version = ++importVersion
  if (file.size > MAX_TEXT_SIZE) {
    error.value = '文件不能超过 1 MiB。'
    return
  }
  try {
    const text = await file.text()
    if (version === importVersion) source.value = text
  } catch {
    if (version === importVersion) error.value = '文件读取失败，请重试。'
  }
}

function example() {
  source.value =
    operation.value === 'csv-json'
      ? 'name,language\nPortfolio,Vue\nFarmer Platform,Java'
      : '[{"name":"Portfolio","language":"Vue"},{"name":"Farmer Platform","language":"Java"}]'
}
</script>

<template>
  <div class="tool-body">
    <div class="tool-intro">
      <h3>结构化数据，整理一下。</h3>
      <p>格式化、压缩或转换表格数据。单次最多 1 MiB，内容只在此浏览器处理。</p>
    </div>
    <div class="tool-options">
      <label
        >处理方式<select v-model="operation">
          <option value="format">JSON 格式化 / 校验</option>
          <option value="minify">JSON 压缩</option>
          <option value="json-csv">JSON → CSV</option>
          <option value="csv-json">CSV → JSON</option>
        </select></label
      >
      <div class="tool-actions">
        <button @click="example">填入示例</button
        ><button @click="fileInput?.click()">导入文件</button
        ><button @click="source = ''">清空</button>
      </div>
      <input ref="fileInput" type="file" accept=".json,.csv,.txt" hidden @change="importFile" />
    </div>
    <div class="editor-grid">
      <label class="source-editor"
        >输入内容<textarea
          v-model="source"
          aria-label="输入内容"
          :maxlength="MAX_TEXT_SIZE"
          placeholder="粘贴 JSON 或 CSV，也可以导入本地文件"
          spellcheck="false"
        /></label
      ><ToolOutput
        :value="result"
        :filename="filename"
        :mime="operation === 'json-csv' ? 'text/csv' : 'application/json'"
      />
    </div>
    <div class="tool-run">
      <button class="run-button" @click="convert">处理内容 ↗</button>
      <p class="tool-error" role="alert">{{ error }}</p>
    </div>
    <p class="tool-note">
      JSON → CSV 支持扁平对象数组；CSV → JSON 保留字符串，避免丢失前导零。嵌套结构会提示错误。
    </p>
  </div>
</template>
