<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'

const tabs = [
  {
    id: 'json',
    title: 'JSON / CSV',
    symbol: '{ }',
    note: '格式化与转换',
    component: defineAsyncComponent(() => import('./tools/JsonTool.vue')),
  },
  {
    id: 'data',
    title: 'Test data',
    symbol: '[ ]',
    note: '算法测试数据',
    component: defineAsyncComponent(() => import('./tools/GeneratorTool.vue')),
  },
]
const active = ref(0)
const tabButtons = ref<HTMLButtonElement[]>([])

function navigate(event: KeyboardEvent, index: number) {
  let target = index
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') target = (index + 1) % tabs.length
  else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft')
    target = (index + tabs.length - 1) % tabs.length
  else if (event.key === 'Home') target = 0
  else if (event.key === 'End') target = tabs.length - 1
  else return
  event.preventDefault()
  active.value = target
  tabButtons.value[target]?.focus()
}
</script>

<template>
  <div class="toolbox" lang="zh-CN">
    <div class="toolbox-tabs" role="tablist" aria-label="选择工具" aria-orientation="vertical">
      <button
        v-for="(tab, index) in tabs"
        :id="`tab-${tab.id}`"
        :key="tab.id"
        ref="tabButtons"
        role="tab"
        :aria-selected="active === index"
        :aria-controls="`panel-${tab.id}`"
        :tabindex="active === index ? 0 : -1"
        @click="active = index"
        @keydown="navigate($event, index)"
      >
        <span class="tool-symbol mono">{{ tab.symbol }}</span
        ><span
          >{{ tab.title }}<small>{{ tab.note }}</small></span
        >
      </button>
      <p class="local-note">本地处理<br />不上传、不保存输入内容</p>
    </div>
    <div
      v-for="(tab, index) in tabs"
      v-show="active === index"
      :id="`panel-${tab.id}`"
      :key="tab.id"
      class="tool-panel"
      role="tabpanel"
      :aria-labelledby="`tab-${tab.id}`"
    >
      <KeepAlive><component :is="tab.component" v-if="active === index" /></KeepAlive>
    </div>
  </div>
</template>

<style>
.toolbox {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  overflow: clip;
}
.toolbox-tabs {
  padding: 1rem;
  border-right: 1px solid var(--line);
}
.toolbox-tabs > button {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.85rem;
  padding: 0.9rem 0.65rem;
  border: 1px solid transparent;
  border-radius: 5px;
  background: transparent;
  text-align: left;
  font-size: 0.8rem;
}
.toolbox-tabs > button[aria-selected='true'] {
  background: var(--accent-soft);
  border-color: var(--accent-border);
  color: var(--accent);
}
.toolbox-tabs small {
  display: block;
  color: var(--muted);
  font-size: 0.7rem;
  margin-top: 0.25rem;
}
.tool-symbol {
  width: 25px;
  flex-shrink: 0;
  color: var(--accent);
}
.local-note {
  margin: 2rem 0.65rem;
  font-size: 0.65rem;
  color: var(--muted);
  line-height: 1.9;
}
.tool-panel {
  min-width: 0;
}
.tool-body {
  padding: 1.75rem;
}
.tool-intro {
  margin-bottom: 1.5rem;
}
.tool-intro h3 {
  font-size: 1.2rem;
  font-weight: 500;
}
.tool-intro p,
.tool-note {
  font-size: 0.75rem;
  color: var(--muted);
  margin-top: 0.6rem;
  line-height: 1.8;
}
.toolbox label {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  color: var(--muted);
  font-size: 0.75rem;
}
.toolbox input,
.toolbox select,
.toolbox textarea {
  border: 1px solid var(--control-line);
  border-radius: 5px;
  background: var(--field);
  color: var(--ink);
  padding: 0.65rem 0.8rem;
  width: 100%;
  font: 0.8rem var(--font-mono);
  min-height: 42px;
}
.toolbox input:focus-visible,
.toolbox select:focus-visible,
.toolbox textarea:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.toolbox textarea {
  min-height: 250px;
  resize: vertical;
  line-height: 1.7;
  tab-size: 2;
  white-space: pre;
}
.toolbox textarea::placeholder,
.toolbox input::placeholder {
  color: var(--placeholder);
}
.toolbox input[hidden] {
  display: none;
}
.toolbox button:not([role='tab']) {
  min-height: 40px;
  padding: 0.55rem 0.85rem;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--surface);
  font-size: 0.75rem;
}
.toolbox button:hover:not(:disabled) {
  border-color: var(--accent);
}
.toolbox .run-button {
  background: var(--accent) !important;
  color: var(--bg);
  border-color: var(--accent) !important;
}
.tool-actions,
.tool-run,
.tool-options {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.tool-options {
  margin-bottom: 1.5rem;
  gap: 1rem;
  align-items: flex-end;
}
.tool-options label {
  min-width: 175px;
}
.tool-run {
  margin-block: 1rem;
}
.editor-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.source-editor {
  padding-top: 0.65rem;
}
.source-editor textarea {
  margin-top: 0.35rem;
}
.output-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.55rem;
  font-size: 0.75rem;
  color: var(--muted);
}
.tool-feedback {
  min-height: 1.4rem;
  font-size: 0.7rem;
  color: var(--accent);
  margin-top: 0.4rem;
}
.tool-error {
  color: var(--danger);
  font-size: 0.75rem;
  overflow-wrap: anywhere;
}
.wide-field {
  max-width: 460px;
  margin-block: 1rem;
}
.generator-fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}
@media (max-width: 1000px) {
  .editor-grid {
    grid-template-columns: 1fr;
  }
  .toolbox {
    grid-template-columns: 175px minmax(0, 1fr);
  }
  .generator-fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 700px) {
  .toolbox {
    grid-template-columns: 1fr;
  }
  .toolbox-tabs {
    display: flex;
    gap: 0.3rem;
    border-right: 0;
    border-bottom: 1px solid var(--line);
    padding: 0.5rem;
  }
  .toolbox-tabs > button {
    flex: 1;
    justify-content: center;
    padding: 0.75rem 0.25rem;
    font-size: 0.7rem;
  }
  .tool-symbol,
  .local-note,
  .toolbox-tabs small {
    display: none;
  }
  .tool-body {
    padding: 1.1rem;
  }
  .generator-fields {
    grid-template-columns: 1fr;
  }
  .tool-options label {
    width: 100%;
    min-width: 0;
  }
}
</style>
