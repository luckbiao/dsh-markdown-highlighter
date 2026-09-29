# dsh-markdown-highlighter

[![dshfind](https://dshfind.com/api/card/luckbiao/dsh-markdown-highlighter?lang=zh)](https://dshfind.com/zh/plugins/luckbiao/dsh-markdown-highlighter?ref=badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

DSH (DeepSeek Harness) Web GUI 消息正文 Markdown 代码块增强插件：**激活内置 Shiki 语法高亮**，赋予 Diff 代码块 **`+` 浅绿 / `-` 浅红底色**，支持 **左右分列 (Split) 与单栏 (Unified) 一键切换** 以及 **Diff 智能自动语言识别与首行提示双重语法高亮**。

---

## 🌟 核心特性

1. **激活 DSH 内置 Shiki 调色盘**
   - 官方已内置完整 Shiki 引擎与 Python、JavaScript、TypeScript、HTML、CSS、SQL 等语法包，本插件精准注入 VS Code 调色盘变量，直接“点亮”全站代码高亮，零重量依赖。
2. **Diff 块浅绿 / 浅红底色**
   - 新增行 `+` 渲染为柔和浅绿背景（GitHub 风格）；
   - 删除行 `-` 渲染为柔和浅红背景；
   - 标头行 `@@` 渲染为浅蓝背景；
   - 消除伪换行与多余留白，保持紧凑自然的原生代码行间距。
3. **三级智能自动语言推断与双重高亮（Dual Highlighting）**
   - **智能嗅探（零配置）**：自动分析 Git Diff 路径（如 `diff --git a/.../file.py` 或 `+++ b/xxx.js`），无需手动标记；若无文件路径，通过内置启发式特征打分器自动识别 Python、JavaScript、HTML 语法特征；
   - **显式指令（最高优先级）**：支持在 Diff 代码块第一行声明语言类型（例如 `# lang: python` 或 `// lang: js`）；
   - 内部代码同时享受 **Diff 增删底色** 与 **VS Code 级别的语法词法彩色**，首行自动渲染精致的语言徽标。
4. **左右分列 (Split View) 一键切换**
   - 代码块右上角注入 `[ ◫ 分栏 / ≡ 单栏 ]` 切换按钮；
   - 采用严格 50%/50% 栅格与水平居中对齐，左侧显示原始删改（ORIGINAL），右侧显示新增修改（MODIFIED），防挤占防溢出。
5. **100% 离线自包含**
   - 纯前端原生极速实现，零外部 CDN，完全适应无网与内网投研环境。

---

## 📦 安装方式

在终端中执行以下命令（任选一种）：

### 方式 1：GitHub 直装（推荐）

```bash
dsh plugin --profile web add "github:luckbiao/dsh-markdown-highlighter"
```

### 方式 2：本地手工配置

1. 将本仓库 clone 到 `~/.dsh/custom-plugins/dsh-markdown-highlighter`
2. 在 `~/.dsh/profiles/web/cordis.patch.yml` 中追加：
   ```yaml
   - insert:
       - id: markdown-highlighter
         name: '@my-plugins/dsh-markdown-highlighter'
   ```
3. 重启 `dsh web` 并在浏览器刷新即可生效。

---

## 💡 使用示例

### 1. 普通 Python 语法高亮
````markdown
```python
def is_trading_day(today: str) -> bool:
    # 自动识别交易日
    return today in trade_dates
```
````

### 2. 标准 Git Diff 自动推断（无需手动加声明）
插件会自动提取文件后缀并渲染语言彩色：
````markdown
```diff
diff --git a/algo_small_value.py b/algo_small_value.py
--- a/algo_small_value.py
+++ b/algo_small_value.py
@@ -178,5 +178,8 @@ class Algo_small_value:
+    def _fallback_to_cache(self, reason: str):
+        now = time.time()
+        if self._cached_data is not None:
+            return self._cached_data
+        return None
```
````

### 3. 首行显式声明语言提示
````markdown
```diff
# lang: python
@@ -160,5 +160,8 @@ def before_reset(self) -> None:
- self.is_trading_day = is_trading_day()
+ self.is_trading_day = False
+ self.trading_day_date = None
+ today = datetime.date.today()
+ self.is_trading_day = is_trading_day(today=today.isoformat())
```
````

---

## 📄 License

[MIT License](LICENSE)
