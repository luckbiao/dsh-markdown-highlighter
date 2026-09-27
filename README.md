# dsh-markdown-highlighter

[![dshfind](https://dshfind.com/api/card/luckbiao/dsh-markdown-highlighter?lang=zh)](https://dshfind.com/zh/plugins/luckbiao/dsh-markdown-highlighter?ref=badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

DSH (DeepSeek Harness) Web GUI 消息正文 Markdown 代码块增强插件：**激活内置 Shiki 语法高亮**，赋予 Diff 代码块 **`+` 浅绿 / `-` 浅红底色**，支持 **左右分列 (Split) 与单栏 (Unified) 一键切换** 以及 **首行语言提示双重高亮**。

---

## 🌟 核心特性

1. **激活 DSH 内置 Shiki 调色盘**
   - 官方已内置完整 Shiki 引擎与 Python、JavaScript、TypeScript、HTML、CSS、SQL 等语法包，本插件精准注入 VS Code 调色盘变量，直接“点亮”全站代码高亮，零重量依赖。
2. **Diff 块浅绿 / 浅红底色**
   - 新增行 `+` 渲染为柔和浅绿背景（GitHub 风格）；
   - 删除行 `-` 渲染为柔和浅红背景；
   - 标头行 `@@` 渲染为浅蓝背景；
   - 消除伪换行与多余留白，保持紧凑自然的原生代码行间距。
3. **首行语言提示双重高亮（Dual Highlighting）**
   - 在 Diff 代码块第一行声明语言类型（例如 `# lang: python` 或 `// lang: js`）；
   - 内部代码即可同时享受 **Diff 底色** 与 **VS Code 级别的语法词法彩色**；
   - 首行自动渲染为精致的语言指示徽标。
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

### 2. 带 Python 语法高亮的 Diff 块
首行使用 `# lang: python` 显式声明：
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
