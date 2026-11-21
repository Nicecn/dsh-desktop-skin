// dsh-aurora-skin —— host 侧占位
//
// 本插件是纯客户端（浏览器端）皮肤：只注入 CSS，不需要任何 host 服务、
// 不注册工具、不读写配置。host 侧的存在只为让插件行能在组合配置里正常加载。
//
// 注意：这里走 ESM（宿主 host 侧走 Node ESM 解析）。
// 客户端那一侧完全不同 —— 见 lib/client.js 顶部注释（必须 ModuleLoader + CommonJS）。

export const name = 'dsh-desktop-skin'
export const inject = []

export function apply() {
  // 无 host 逻辑
}
