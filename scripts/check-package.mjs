/**
 * Validate the published contract of this bundle before CI publishes it:
 * the package name must match the client module id and the patch row, every
 * link must have an inlined icon plus an icon source, and the icon build must
 * stay self-consistent.
 */
import { readFile, readdir } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const read = file => readFile(new URL(file, root), 'utf8')
const fail = message => { throw new Error(`check-package: ${message}`) }

const pkg = JSON.parse(await read('package.json'))
if (pkg.private === true) fail('package.json must not be private')
if (pkg.name !== '@yunlai/dsh-ai-quick-links') fail(`unexpected package name ${pkg.name}`)
if (!/^\d+\.\d+\.\d+$/.test(pkg.version)) fail(`version must be plain semver, got ${pkg.version}`)
if (pkg.publishConfig?.access !== 'public') fail('publishConfig.access must be public')

const client = await read('client.js')
if (!client.includes(`id: '${pkg.name}'`)) fail(`client.js module id does not match ${pkg.name}`)
if (client.includes('@local/')) fail('client.js still references @local')

const patch = await read('cordis.patch.yml')
if (!patch.includes("    - id: ai-quick-links\n")) fail('cordis.patch.yml must insert row ai-quick-links')
if (!patch.includes(`      name: '${pkg.name}'`)) fail('cordis.patch.yml row name does not match the package name')

const links = [...client.matchAll(/\{ id: '(\w+)', name: '[^']+', url: '[^']+', group: '\w+' \}/g)].map(match => match[1])
if (links.length === 0) fail('no LINKS entries found in client.js')
if (new Set(links).size !== links.length) fail('duplicate link ids in LINKS')

const iconKeys = [...client.matchAll(/^      (\w+): "data:image\/svg\+xml,/gm)].map(match => match[1])
const duplicates = iconKeys.filter((id, index) => iconKeys.indexOf(id) !== index)
if (duplicates.length > 0) fail(`duplicate inlined icons: ${duplicates.join(', ')}`)
for (const id of links) {
  if (!iconKeys.includes(id)) fail(`link ${id} has no inlined icon; run node build-icons.mjs`)
}

const buildScript = await read('build-icons.mjs')
const mappings = [...buildScript.matchAll(/\['(\w+)', '([\w.-]+\.svg)'\]/g)].map(match => ({ id: match[1], file: match[2] }))
for (const id of links) {
  if (!mappings.some(mapping => mapping.id === id)) fail(`link ${id} has no icon mapping in build-icons.mjs`)
}
const iconFiles = new Set(await readdir(new URL('icons/', root)))
for (const mapping of mappings) {
  if (!iconFiles.has(mapping.file)) fail(`icons/${mapping.file} is missing`)
}
for (const file of iconFiles) {
  if (!mappings.some(mapping => mapping.file === file)) fail(`icons/${file} is not referenced by build-icons.mjs`)
}

for (const [file, title] of [['en.json', 'en'], ['zh.json', 'zh']]) {
  const dictionary = JSON.parse(await read(`locale/${file}`))
  if (typeof dictionary.meta?.title !== 'string' || dictionary.meta.title === '') fail(`locale/${file} lacks meta.title`)
  if (typeof dictionary.meta?.description !== 'string' || dictionary.meta.description === '') fail(`locale/${file} lacks meta.description`)
}

for (const file of ['client.js', 'index.js', 'cordis.patch.yml', 'icon.svg', 'README.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md']) {
  await read(file)
}

console.log(`check-package: ok (${links.length} links, ${iconKeys.length} inlined icons, version ${pkg.version})`)
