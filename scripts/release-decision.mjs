/**
 * Decide what the release workflow does for the current commit: publish the
 * current version, publish an automatic patch bump, or only add the missing
 * tag/release. Writes `version`, `bump`, and `action` to GITHUB_OUTPUT.
 */
import { readFile, writeFile, appendFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const run = promisify(execFile)
const REGISTRY = 'https://registry.npmjs.org'
const packageFile = new URL('../package.json', import.meta.url)
const pkg = JSON.parse(await readFile(packageFile, 'utf8'))

/** Whether this exact version already exists in the registry. */
async function isPublished(version) {
  try {
    const { stdout } = await run('npm', ['view', `${pkg.name}@${version}`, 'version', '--json', `--registry=${REGISTRY}`], { timeout: 120_000 })
    return stdout.trim() !== ''
  } catch (error) {
    const output = `${error.stderr ?? ''}${error.stdout ?? ''}`
    if (output.includes('E404') || output.includes('404 Not Found')) return false
    throw error
  }
}

/** Whether the release tag for this version already exists locally. */
async function isTagged(version) {
  try {
    await run('git', ['rev-parse', '--verify', '--quiet', `refs/tags/v${version}`])
    return true
  } catch {
    return false
  }
}

/** Increment the patch component, dropping any prerelease suffix. */
function bumpPatch(version) {
  const [major, minor, patch] = version.split('-')[0].split('.').map(Number)
  return `${major}.${minor}.${patch + 1}`
}

const version = pkg.version
const published = await isPublished(version)
const tagged = await isTagged(version)

let next = version
let bump = false
let action
if (published && tagged) {
  next = bumpPatch(version)
  pkg.version = next
  await writeFile(packageFile, `${JSON.stringify(pkg, null, 2)}\n`)
  bump = true
  action = 'publish'
} else if (!published) {
  action = 'publish'
} else {
  action = 'tag-only'
}

console.log(`release-decision: ${action}${bump ? ` (bumped ${version} -> ${next})` : ` (version ${next})`}`)
if (process.env.GITHUB_OUTPUT !== undefined) {
  await appendFile(process.env.GITHUB_OUTPUT, `version=${next}\nbump=${bump}\naction=${action}\n`)
}
