export const MAX_TEXT_SIZE = 1024 * 1024

export type Conversion = 'format' | 'minify' | 'json-csv' | 'csv-json'

export function parseCsv(source: string): string[][] {
  const text = source.replace(/^\uFEFF/, '')
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  let closed = false
  for (let index = 0; index < text.length; index++) {
    const character = text[index]!
    if (quoted) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          field += '"'
          index++
        } else {
          quoted = false
          closed = true
        }
      } else field += character
    } else if (character === ',' || character === '\n' || character === '\r') {
      row.push(field)
      field = ''
      closed = false
      if (character !== ',') {
        rows.push(row)
        row = []
        if (character === '\r' && text[index + 1] === '\n') index++
      }
    } else if (closed) {
      throw new Error('CSV 引号结束后只能出现逗号或换行。')
    } else if (character === '"') {
      if (field.length) throw new Error('CSV 字段内的引号需要使用双引号转义。')
      quoted = true
    } else field += character
  }
  if (quoted) throw new Error('CSV 存在未闭合的引号。')
  if (field || row.length || closed) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

export function convertText(source: string, operation: Conversion): string {
  if (!source.trim()) throw new Error('请先输入内容或导入文件。')
  if (new Blob([source]).size > MAX_TEXT_SIZE) throw new Error('请使用不超过 1 MiB 的文本。')
  if (operation === 'csv-json') {
    const [headers, ...rows] = parseCsv(source)
    if (!headers?.length || headers.some(header => !header.trim()))
      throw new Error('CSV 首行需要非空列名。')
    if (new Set(headers).size !== headers.length) throw new Error('CSV 列名不能重复。')
    return JSON.stringify(
      rows.map((row, index) => {
        if (row.length !== headers.length)
          throw new Error(`CSV 第 ${index + 2} 条记录的列数与表头不一致。`)
        return Object.fromEntries(headers.map((header, column) => [header, row[column]]))
      }),
      null,
      2
    )
  }
  const value: unknown = JSON.parse(source.replace(/^\uFEFF/, ''), (_key, entry: unknown) => {
    if (
      typeof entry === 'number' &&
      (!Number.isFinite(entry) || (Number.isInteger(entry) && !Number.isSafeInteger(entry)))
    ) {
      throw new Error('数字超出 JavaScript 安全范围，请将大整数保存为字符串。')
    }
    return entry
  })
  if (operation !== 'json-csv')
    return JSON.stringify(value, null, operation === 'format' ? 2 : undefined)
  if (
    !Array.isArray(value) ||
    !value.length ||
    value.some(row => !row || typeof row !== 'object' || Array.isArray(row))
  ) {
    throw new Error('JSON → CSV 需要非空对象数组，例如 [{"name":"TFGKK"}]。')
  }
  const records = value as Record<string, unknown>[]
  const headers = [...new Set(records.flatMap(row => Object.keys(row)))]
  if (!headers.length) throw new Error('对象中至少需要一个字段。')
  if (headers.length * records.length > 200000)
    throw new Error('转换结果超过 200,000 个单元格，请减少数据或字段数量。')
  const escape = (entry: unknown): string => {
    if (entry !== null && typeof entry === 'object')
      throw new Error('CSV 不支持嵌套对象或数组，请先将数据展开为表格。')
    const text = entry == null ? '' : String(entry)
    return /[",\r\n]/.test(text) ? `"${text.split('"').join('""')}"` : text
  }
  return [
    headers.map(escape).join(','),
    ...records.map(row =>
      headers
        .map(header => escape(Object.prototype.hasOwnProperty.call(row, header) ? row[header] : ''))
        .join(',')
    ),
  ].join('\r\n')
}

export interface GeneratorOptions {
  kind: 'array' | 'permutation' | 'tree'
  count: number
  minimum: number
  maximum: number
  seed: number
}

export function generateData(options: GeneratorOptions): string {
  const { kind, count, minimum, maximum, seed } = options
  if (!Number.isInteger(count) || count < 1 || count > 10000)
    throw new Error('数量必须为 1 到 10,000 的整数。')
  if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295)
    throw new Error('种子必须为 0 到 4,294,967,295 的整数。')
  if (
    kind === 'array' &&
    (!Number.isInteger(minimum) ||
      !Number.isInteger(maximum) ||
      minimum < -1000000000 ||
      maximum > 1000000000 ||
      minimum > maximum)
  ) {
    throw new Error('数值范围需为 -10⁹ 到 10⁹ 内的整数，且最小值不能大于最大值。')
  }
  let state = seed >>> 0
  const random = () => {
    state = (state + 0x6d2b79f5) >>> 0
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state)
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }
  if (kind === 'tree') {
    const edges = Array.from(
      { length: count - 1 },
      (_, index) => `${Math.floor(random() * (index + 1)) + 1} ${index + 2}`
    )
    return [String(count), ...edges].join('\n')
  }
  const values = Array.from({ length: count }, (_, index) =>
    kind === 'permutation' ? index + 1 : minimum + Math.floor(random() * (maximum - minimum + 1))
  )
  if (kind === 'permutation') {
    for (let index = count - 1; index > 0; index--) {
      const target = Math.floor(random() * (index + 1))
      const held = values[index]!
      values[index] = values[target]!
      values[target] = held
    }
  }
  return `${count}\n${values.join(' ')}`
}
