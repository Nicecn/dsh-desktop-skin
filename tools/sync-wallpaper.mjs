// dsh-aurora-skin —— 把 assets/wallpaper.jpg 同步进 lib/client.js 的 WALLPAPER 常量
// （前端工程师 · 2026-11-21）
//
// 为什么需要这一步：客户端插件只能加载 lib/client.js 一个入口，插件目录当前也没有
// 可用的静态资源 URL（2026-11-21 实测 /plugins/... 与 /plugin-assets/... 都是 404，
// /api/plugins/... 401），所以壁纸只能以 data URI 内嵌进客户端脚本。
//
// 用法（换图后跑一次）：
//   node tools/sync-wallpaper.mjs            # 写入 lib/client.js
//   node tools/sync-wallpaper.mjs --dry-run  # 只报告将要替换的长度，不落盘
//
// 它只会替换「const WALLPAPER = '...'」这一处，不动文件里其它任何字节。
import { readFileSync, writeFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const imgPath = join(root, 'assets', 'wallpaper.jpg')
const jsPath = join(root, 'lib', 'client.js')
const dryRun = process.argv.includes('--dry-run')

const img = readFileSync(imgPath)
const uri = 'data:image/jpeg;base64,' + img.toString('base64')

const src = readFileSync(jsPath, 'utf8')
const re = /const WALLPAPER = '(?:data:image\/jpeg;base64,[A-Za-z0-9+/=]*)?'/
if (!re.test(src)) {
  console.error('[sync-wallpaper] 没找到 const WALLPAPER = \'...\' 这一行，什么都没改')
  process.exit(1)
}
const out = src.replace(re, () => "const WALLPAPER = '" + uri + "'")

console.log('[sync-wallpaper] 图片 ' + imgPath + '  ' + statSync(imgPath).size + ' B')
console.log('[sync-wallpaper] data URI 长度 ' + uri.length + ' 字符')
console.log('[sync-wallpaper] client.js ' + src.length + ' -> ' + out.length + ' 字符')
if (dryRun) {
  console.log('[sync-wallpaper] --dry-run：未落盘')
  process.exit(0)
}
if (out === src) {
  console.log('[sync-wallpaper] 内容一致，不需要写')
  process.exit(0)
}
writeFileSync(jsPath, out, 'utf8')
console.log('[sync-wallpaper] 已写入 ' + jsPath)
