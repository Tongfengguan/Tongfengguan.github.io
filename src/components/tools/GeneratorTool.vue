<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { generateData, type GeneratorOptions } from '../../utils/toolbox'
import ToolOutput from './ToolOutput.vue'

const options = reactive<GeneratorOptions>({
  kind: 'array',
  count: 10,
  minimum: 1,
  maximum: 100,
  seed: 42,
})
const result = ref('')
const error = ref('')
watch(options, () => {
  result.value = ''
  error.value = ''
})

function generate() {
  try {
    result.value = generateData(options)
    error.value = ''
  } catch (failure) {
    result.value = ''
    error.value = failure instanceof Error ? failure.message : '生成失败。'
  }
}

function randomizeSeed() {
  options.seed = crypto.getRandomValues(new Uint32Array(1))[0]!
}
</script>

<template>
  <div class="tool-body">
    <div class="tool-intro">
      <h3>给下一次调试，造一组数据。</h3>
      <p>固定参数和种子产生相同结果。支持随机数组、排列和无向树，最多 10,000 个元素或节点。</p>
    </div>
    <div class="generator-fields">
      <label
        >数据类型<select v-model="options.kind">
          <option value="array">随机整数数组</option>
          <option value="permutation">1…n 随机排列</option>
          <option value="tree">无向树（1…n）</option>
        </select></label
      ><label
        >数量 n<input
          v-model.number="options.count"
          type="number"
          min="1"
          max="10000"
          step="1" /></label
      ><label
        >随机种子<input
          v-model.number="options.seed"
          type="number"
          min="0"
          max="4294967295"
          step="1" /></label
      ><template v-if="options.kind === 'array'"
        ><label
          >最小值<input
            v-model.number="options.minimum"
            type="number"
            min="-1000000000"
            max="1000000000"
            step="1" /></label
        ><label
          >最大值<input
            v-model.number="options.maximum"
            type="number"
            min="-1000000000"
            max="1000000000"
            step="1" /></label
      ></template>
    </div>
    <div class="tool-run">
      <button class="run-button" @click="generate">生成测试数据 ↗</button
      ><button @click="randomizeSeed">换个种子</button>
      <p class="tool-error" role="alert">{{ error }}</p>
    </div>
    <ToolOutput :value="result" filename="input.txt" />
    <p class="tool-note">
      首行为 n；数组与排列的第二行是数据。树随后输出 n−1 条边，保证连通、无环；单节点树仅输出 1。
    </p>
  </div>
</template>
