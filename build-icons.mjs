/**
 * Inline the brand SVGs under icons/ into client.js as data URIs.
 *
 * The client half is one IIFE with no asset route of its own, so the marks
 * travel inside the module. Run `node build-icons.mjs` after changing icons/
 * or the icon order below; the client entry hot-reloads when client.js changes.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('.', import.meta.url))
const CLIENT = `${ROOT}client.js`
const REGION = /[ \t]*\/\* generated:icons:start \*\/[\s\S]*?\/\* generated:icons:end \*\//

/** Link id → icon file; the id keys the ICONS map the client renders. */
const ICONS = [
  ['deepseek', 'deepseek.svg'],
  ['kimi', 'kimi.svg'],
  ['qwen', 'qwen.svg'],
  ['doubao', 'doubao.svg'],
  ['yuanbao', 'yuanbao.svg'],
  ['wenxin', 'wenxin.svg'],
  ['chatglm', 'chatglm.svg'],
  ['spark', 'spark.svg'],
  ['hailuo', 'hailuo.svg'],
  ['tiangong', 'tiangong.svg'],
  ['chatgpt', 'openai.svg'],
  ['claude', 'claude.svg'],
  ['gemini', 'gemini.svg'],
  ['perplexity', 'perplexity.svg'],
  ['grok', 'grok.svg'],
  ['copilot', 'copilot.svg'],
  ['metaai', 'metaai.svg'],
  ['mistral', 'mistral.svg'],
  ['poe', 'poe.svg'],
  ['huggingface', 'huggingface.svg'],
]

/** Normalize one source SVG into a standalone data URI. */
function dataUri(source) {
  const svg = source
    .replace(/\s+style="[^"]*"/g, '')
    .replace(/\s+width="1em"/g, '')
    .replace(/\s+height="1em"/g, '')
    .replaceAll('fill="currentColor"', 'fill="#111111"')
    .replace(/\s*\n\s*/g, '')
    .trim()
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const lines = []
for (const [id, file] of ICONS) {
  const source = await readFile(`${ROOT}icons/${file}`, 'utf8')
  lines.push(`      ${id}: ${JSON.stringify(dataUri(source))},`)
}
const block = [
  '    /* generated:icons:start */',
  '    /** Brand marks inlined as SVG data URIs; run `node build-icons.mjs` to regenerate. */',
  '    const ICONS = {',
  ...lines,
  '    };',
  '    /* generated:icons:end */',
].join('\n')

const client = await readFile(CLIENT, 'utf8')
if (!REGION.test(client)) throw new Error('client.js is missing the generated:icons markers')
await writeFile(CLIENT, client.replace(REGION, block))
console.log(`inlined ${ICONS.length} brand icons into client.js`)
