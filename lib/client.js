window.__ModuleLoader__.load({
  id: "@my-plugins/dsh-markdown-highlighter",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    // =========================================================================
    // 1. 注入样式表（VS Code 调色盘 + Diff 行底色 + 徽标 + 双栏分屏样式）
    // =========================================================================
    const STYLE_ID = "dsh-markdown-highlighter-style";
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
        /* ===== VS Code Dark+ 调色盘变量（点亮 DSH 内置 Shiki & 我们的 Diff Tokenizer） ===== */
        :root, [data-theme="dark"] {
          --shiki-foreground: #d4d4d4;
          --shiki-background: transparent;
          --shiki-token-keyword: #569cd6;              /* def, class, return, if, const, let */
          --shiki-token-function: #dcdcaa;             /* 函数名 / 方法调用 */
          --shiki-token-string: #ce9178;               /* 字符串 */
          --shiki-token-string-expression: #d7ba7d;    /* 正则 / f-string */
          --shiki-token-comment: #6a9955;              /* 注释（灰绿） */
          --shiki-token-constant: #4fc1ff;             /* 常量 / 数字 / True / None */
          --shiki-token-parameter: #9cdcfe;            /* 变量 / self / 参数 */
          --shiki-token-punctuation: #d4d4d4;          /* 标点 () {} [] : */
          --shiki-token-link: #4ec9b0;                 /* 类型注解 / 类名 */
        }

        /* 亮色模式支持（Light+） */
        [data-theme="light"] {
          --shiki-foreground: #24292e;
          --shiki-background: transparent;
          --shiki-token-keyword: #d73a49;
          --shiki-token-function: #6f42c1;
          --shiki-token-string: #032f62;
          --shiki-token-string-expression: #005cc5;
          --shiki-token-comment: #6a737d;
          --shiki-token-constant: #005cc5;
          --shiki-token-parameter: #24292e;
          --shiki-token-punctuation: #24292e;
          --shiki-token-link: #22863a;
        }

        /* ===== Diff 容器与行样式（保持紧凑行高） ===== */
        .md-code-block[data-code-lang="diff"] pre,
        .dsh-diff-container {
          font-family: var(--dsw-font-code, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
        }

        .dsh-diff-line {
          display: block;
          width: 100%;
          line-height: inherit;
          padding: 1px 8px;
          margin: 0 -8px;
          box-sizing: content-box;
          white-space: pre;
        }

        /* 切换按钮 (Split / Unified) */
        .dsh-diff-toggle-btn {
          background: none;
          border: 1px solid rgba(110, 118, 129, 0.3);
          border-radius: 4px;
          padding: 2px 7px;
          margin-right: 6px;
          font-size: 11px;
          line-height: 14px;
          color: inherit;
          opacity: 0.75;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.15s ease;
          user-select: none;
        }
        .dsh-diff-toggle-btn:hover {
          opacity: 1;
          background: rgba(110, 118, 129, 0.15);
          border-color: rgba(110, 118, 129, 0.5);
        }

        /* 首行语言提示徽标 */
        .dsh-diff-badge-line {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 2px 8px;
          margin-bottom: 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          background: rgba(110, 118, 129, 0.2);
          color: var(--shiki-token-parameter, #9cdcfe);
          border: 1px solid rgba(110, 118, 129, 0.3);
          user-select: none;
        }

        /* 新增行：浅绿底色 */
        .dsh-diff-line-added {
          background-color: rgba(46, 160, 67, 0.18) !important;
        }
        [data-theme="light"] .dsh-diff-line-added {
          background-color: rgba(46, 160, 67, 0.14) !important;
        }

        /* 删除行：浅红底色 */
        .dsh-diff-line-deleted {
          background-color: rgba(248, 81, 73, 0.18) !important;
        }
        [data-theme="light"] .dsh-diff-line-deleted {
          background-color: rgba(248, 81, 73, 0.14) !important;
        }

        /* Hunk 标头行 (@@ -1,5 +1,6 @@) */
        .dsh-diff-line-hunk {
          background-color: rgba(56, 139, 253, 0.15) !important;
          color: #79c0ff !important;
        }
        [data-theme="light"] .dsh-diff-line-hunk {
          background-color: rgba(56, 139, 253, 0.1) !important;
          color: #0969da !important;
        }

        /* 前缀符号（+ 或 -）单独强化透明度与对齐 */
        .dsh-diff-prefix {
          display: inline-block;
          width: 1.2ch;
          user-select: none;
          font-weight: 600;
        }
        .dsh-diff-prefix-add { color: #3fb950; }
        .dsh-diff-prefix-del { color: #f85149; }

        /* ===== 左右双栏分屏样式 (Split View) ===== */
        .dsh-diff-split-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 100%;
          box-sizing: border-box;
          font-family: inherit;
        }
        .dsh-diff-split-header {
          display: flex;
          width: 100%;
          border-bottom: 1px solid rgba(110, 118, 129, 0.2);
          margin-bottom: 2px;
          user-select: none;
        }
        .dsh-diff-split-header-col {
          flex: 0 0 50%;
          width: 50%;
          padding: 2px 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          opacity: 0.7;
          box-sizing: border-box;
        }
        .dsh-diff-split-header-left {
          border-right: 1px solid rgba(110, 118, 129, 0.25);
          color: #f85149;
        }
        .dsh-diff-split-header-right {
          color: #3fb950;
        }
        .dsh-diff-split-row {
          display: flex;
          width: 100%;
          line-height: inherit;
          box-sizing: border-box;
        }
        .dsh-diff-split-cell {
          flex: 0 0 50%;
          width: 50%;
          min-width: 0; /* 关键：防止超宽文本挤爆右栏 */
          padding: 1px 8px;
          vertical-align: top;
          overflow-x: auto;
          white-space: pre;
          box-sizing: border-box;
        }
        .dsh-diff-split-cell-left {
          border-right: 1px solid rgba(110, 118, 129, 0.25);
        }
        .dsh-diff-split-cell-empty {
          background: rgba(110, 118, 129, 0.05);
          user-select: none;
        }
        .dsh-diff-split-hunk-row {
          display: flex;
          width: 100%;
          padding: 2px 8px;
          background-color: rgba(56, 139, 253, 0.15) !important;
          color: #79c0ff !important;
          font-style: italic;
          box-sizing: border-box;
        }

        /* 行内语法 Token 类（强制提高优先级，防止被全局 code 文字颜色覆盖） */
        .tok-kw  { color: #569cd6 !important; font-weight: 600 !important; }
        .tok-fn  { color: #dcdcaa !important; }
        .tok-str { color: #ce9178 !important; }
        .tok-com { color: #6a9955 !important; font-style: italic !important; }
        .tok-num { color: #4fc1ff !important; }
        .tok-var { color: #9cdcfe !important; }
        .tok-cls { color: #4ec9b0 !important; }

        [data-theme="light"] .tok-kw  { color: #d73a49 !important; font-weight: 600 !important; }
        [data-theme="light"] .tok-fn  { color: #6f42c1 !important; }
        [data-theme="light"] .tok-str { color: #032f62 !important; }
        [data-theme="light"] .tok-com { color: #6a737d !important; font-style: italic !important; }
        [data-theme="light"] .tok-num { color: #005cc5 !important; }
        [data-theme="light"] .tok-var { color: #24292e !important; }
        [data-theme="light"] .tok-cls { color: #22863a !important; }
      `;
      document.head.appendChild(style);
    }

    // =========================================================================
    // 2. 自包含极速词法 Tokenizer（支持 Python, JavaScript/TypeScript, HTML）
    // =========================================================================
    const ESCAPE_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    function escapeHtml(str) {
      return str.replace(/[&<>"']/g, (m) => ESCAPE_MAP[m]);
    }

    const PY_KEYWORDS = new Set([
      "def", "class", "if", "elif", "else", "for", "while", "try", "except", "finally",
      "with", "as", "import", "from", "return", "yield", "break", "continue", "pass",
      "raise", "lambda", "async", "await", "assert", "global", "nonlocal", "in", "is",
      "not", "and", "or"
    ]);
    const PY_CONSTANTS = new Set(["True", "False", "None"]);

    function highlightPython(codeText) {
      const regex = /(#.*$)|("""[\s\S]*?"""|'''[\s\S]*?'''|f?"(?:\\.|[^"\\])*"|f?'(?:\\.|[^'\\])*')|(\b[a-zA-Z_]\w*\b)|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|([()\[\]{},.:]|->|==|!=|<=|>=|\+=|-=|\*=|\/=)/gm;
      let html = "";
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(codeText)) !== null) {
        if (match.index > lastIndex) {
          html += escapeHtml(codeText.slice(lastIndex, match.index));
        }
        const [full, comment, string, word, number] = match;

        if (comment) {
          html += `<span class="tok-com">${escapeHtml(comment)}</span>`;
        } else if (string) {
          html += `<span class="tok-str">${escapeHtml(string)}</span>`;
        } else if (word) {
          if (PY_KEYWORDS.has(word)) {
            html += `<span class="tok-kw">${escapeHtml(word)}</span>`;
          } else if (PY_CONSTANTS.has(word)) {
            html += `<span class="tok-num">${escapeHtml(word)}</span>`;
          } else if (word === "self" || word === "cls") {
            html += `<span class="tok-var">${escapeHtml(word)}</span>`;
          } else {
            const rest = codeText.slice(regex.lastIndex);
            if (/^\s*\(/.test(rest)) {
              html += `<span class="tok-fn">${escapeHtml(word)}</span>`;
            } else if (/^[A-Z][a-zA-Z0-9_]*$/.test(word)) {
              html += `<span class="tok-cls">${escapeHtml(word)}</span>`;
            } else {
              html += `<span class="tok-var">${escapeHtml(word)}</span>`;
            }
          }
        } else if (number) {
          html += `<span class="tok-num">${escapeHtml(number)}</span>`;
        } else {
          html += escapeHtml(full);
        }
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < codeText.length) {
        html += escapeHtml(codeText.slice(lastIndex));
      }
      return html;
    }

    const JS_KEYWORDS = new Set([
      "function", "const", "let", "var", "return", "if", "else", "for", "while",
      "switch", "case", "break", "continue", "try", "catch", "finally", "throw",
      "class", "extends", "new", "import", "export", "from", "default", "async",
      "await", "typeof", "instanceof", "in", "of"
    ]);
    const JS_CONSTANTS = new Set(["true", "false", "null", "undefined"]);

    function highlightJs(codeText) {
      const regex = /(\/\/.*$|\/\*[\s\S]*?\*\/)|(`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b[a-zA-Z_$][\w$]*\b)|(\b\d+(?:\.\d+)?\b)|([()\[\]{},.:]|=>|===|!==|==|!=|<=|>=)/gm;
      let html = "";
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(codeText)) !== null) {
        if (match.index > lastIndex) {
          html += escapeHtml(codeText.slice(lastIndex, match.index));
        }
        const [full, comment, string, word, number] = match;

        if (comment) {
          html += `<span class="tok-com">${escapeHtml(comment)}</span>`;
        } else if (string) {
          html += `<span class="tok-str">${escapeHtml(string)}</span>`;
        } else if (word) {
          if (JS_KEYWORDS.has(word)) {
            html += `<span class="tok-kw">${escapeHtml(word)}</span>`;
          } else if (JS_CONSTANTS.has(word)) {
            html += `<span class="tok-num">${escapeHtml(word)}</span>`;
          } else if (word === "this") {
            html += `<span class="tok-var">${escapeHtml(word)}</span>`;
          } else {
            const rest = codeText.slice(regex.lastIndex);
            if (/^\s*\(/.test(rest)) {
              html += `<span class="tok-fn">${escapeHtml(word)}</span>`;
            } else if (/^[A-Z][a-zA-Z0-9_$]*$/.test(word)) {
              html += `<span class="tok-cls">${escapeHtml(word)}</span>`;
            } else {
              html += escapeHtml(word);
            }
          }
        } else if (number) {
          html += `<span class="tok-num">${escapeHtml(number)}</span>`;
        } else {
          html += escapeHtml(full);
        }
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < codeText.length) {
        html += escapeHtml(codeText.slice(lastIndex));
      }
      return html;
    }

    function highlightHtml(codeText) {
      const regex = /(<!--[\s\S]*?-->)|(<\/?[a-zA-Z0-9_-]+)|([a-zA-Z0-9_-]+)(?=\s*=)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\/?>)/g;
      let html = "";
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(codeText)) !== null) {
        if (match.index > lastIndex) {
          html += escapeHtml(codeText.slice(lastIndex, match.index));
        }
        const [full, comment, tag, attr, str, closeTag] = match;
        if (comment) {
          html += `<span class="tok-com">${escapeHtml(comment)}</span>`;
        } else if (tag) {
          html += `<span class="tok-kw">${escapeHtml(tag)}</span>`;
        } else if (attr) {
          html += `<span class="tok-fn">${escapeHtml(attr)}</span>`;
        } else if (str) {
          html += `<span class="tok-str">${escapeHtml(str)}</span>`;
        } else if (closeTag) {
          html += `<span class="tok-kw">${escapeHtml(closeTag)}</span>`;
        } else {
          html += escapeHtml(full);
        }
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < codeText.length) {
        html += escapeHtml(codeText.slice(lastIndex));
      }
      return html;
    }

    function highlightCodeByLang(code, lang) {
      if (!lang) return escapeHtml(code);
      const l = lang.toLowerCase();
      if (l === "python" || l === "py") return highlightPython(code);
      if (l === "javascript" || l === "js" || l === "typescript" || l === "ts" || l === "jsx" || l === "tsx") return highlightJs(code);
      if (l === "html" || l === "xml" || l === "vue") return highlightHtml(code);
      return escapeHtml(code);
    }

    // =========================================================================
    // 3. 构建视图 HTML（单栏 Unified vs 左右双栏 Split）
    // =========================================================================
    function buildUnifiedHtml(lines, startIndex, targetLang) {
      let html = "";
      if (targetLang) {
        html += `<div class="dsh-diff-badge-line"><span style="opacity:0.7">LANG:</span> <span>${escapeHtml(targetLang)}</span></div>`;
      }
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        let lineClass = "dsh-diff-line";
        let prefixChar = "";
        let prefixClass = "dsh-diff-prefix";
        let content = line;

        if (line.startsWith("+") && !line.startsWith("+++")) {
          lineClass += " dsh-diff-line-added";
          prefixChar = "+";
          prefixClass += " dsh-diff-prefix-add";
          content = line.slice(1);
        } else if (line.startsWith("-") && !line.startsWith("---")) {
          lineClass += " dsh-diff-line-deleted";
          prefixChar = "-";
          prefixClass += " dsh-diff-prefix-del";
          content = line.slice(1);
        } else if (line.startsWith("@@")) {
          lineClass += " dsh-diff-line-hunk";
          content = line;
        }

        const highlightedContent = (lineClass.includes("dsh-diff-line-hunk") || !targetLang)
          ? escapeHtml(content)
          : highlightCodeByLang(content, targetLang);
        const prefixHtml = prefixChar ? `<span class="${prefixClass}">${prefixChar}</span>` : "";
        html += `<span class="${lineClass}">${prefixHtml}${highlightedContent}</span>`;
      }
      return html;
    }

    function buildSplitHtml(lines, startIndex, targetLang) {
      let html = "";
      if (targetLang) {
        html += `<div class="dsh-diff-badge-line"><span style="opacity:0.7">LANG:</span> <span>${escapeHtml(targetLang)}</span></div>`;
      }

      html += `<div class="dsh-diff-split-container">`;
      // 栏目头
      html += `
        <div class="dsh-diff-split-header">
          <div class="dsh-diff-split-header-col dsh-diff-split-header-left">ORIGINAL (-)</div>
          <div class="dsh-diff-split-header-col dsh-diff-split-header-right">MODIFIED (+)</div>
        </div>`;

      let i = startIndex;
      while (i < lines.length) {
        const line = lines[i];

        // Hunk 标头行 @@
        if (line.startsWith("@@")) {
          html += `<div class="dsh-diff-split-hunk-row">${escapeHtml(line)}</div>`;
          i++;
          continue;
        }

        // 普通未改动行（空格开头或无前缀）
        if (!line.startsWith("+") && !line.startsWith("-")) {
          const content = line.startsWith(" ") ? line.slice(1) : line;
          const highlighted = targetLang ? highlightCodeByLang(content, targetLang) : escapeHtml(content);
          html += `
            <div class="dsh-diff-split-row">
              <div class="dsh-diff-split-cell dsh-diff-split-cell-left">${highlighted}</div>
              <div class="dsh-diff-split-cell">${highlighted}</div>
            </div>`;
          i++;
          continue;
        }

        // Git 头部信息（--- a/... 或 +++ b/... 或 diff --git 等），作为特殊行显示并步进
        if (line.startsWith("---") || line.startsWith("+++")) {
          html += `<div class="dsh-diff-split-hunk-row">${escapeHtml(line)}</div>`;
          i++;
          continue;
        }

        // 收集连续的删除行和新增行配对
        const dels = [];
        const adds = [];

        while (i < lines.length && (lines[i].startsWith("-") && !lines[i].startsWith("---"))) {
          dels.push(lines[i].slice(1));
          i++;
        }
        while (i < lines.length && (lines[i].startsWith("+") && !lines[i].startsWith("+++"))) {
          adds.push(lines[i].slice(1));
          i++;
        }

        const maxPairs = Math.max(dels.length, adds.length);
        if (maxPairs === 0) {
          // 防御兜底：如果既不是普通行，又未能收集到任何新增/删除行，强制前进一行，杜绝死循环
          i++;
          continue;
        }
        for (let p = 0; p < maxPairs; p++) {
          const leftText = dels[p];
          const rightText = adds[p];

          let leftCell = "";
          let rightCell = "";

          if (leftText !== undefined) {
            const highLeft = targetLang ? highlightCodeByLang(leftText, targetLang) : escapeHtml(leftText);
            leftCell = `<div class="dsh-diff-split-cell dsh-diff-split-cell-left dsh-diff-line-deleted"><span class="dsh-diff-prefix dsh-diff-prefix-del">-</span>${highLeft}</div>`;
          } else {
            leftCell = `<div class="dsh-diff-split-cell dsh-diff-split-cell-left dsh-diff-split-cell-empty"> </div>`;
          }

          if (rightText !== undefined) {
            const highRight = targetLang ? highlightCodeByLang(rightText, targetLang) : escapeHtml(rightText);
            rightCell = `<div class="dsh-diff-split-cell dsh-diff-line-added"><span class="dsh-diff-prefix dsh-diff-prefix-add">+</span>${highRight}</div>`;
          } else {
            rightCell = `<div class="dsh-diff-split-cell dsh-diff-split-cell-empty"> </div>`;
          }

          html += `<div class="dsh-diff-split-row">${leftCell}${rightCell}</div>`;
        }
      }

      html += `</div>`;
      return html;
    }

    // =========================================================================
    // 4. Diff 代码块处理器（挂载切换按钮 + 渲染）
    // =========================================================================
    function processDiffBlock(blockEl) {
      const banner = blockEl.querySelector('[data-code-block-banner] [class*="infostring"]') || blockEl.querySelector('[class*="banner"] [class*="lang"]');
      const langText = (banner ? banner.textContent : "").trim().toLowerCase();
      
      const contentDiv = blockEl.querySelector('[data-code-block-content]') || blockEl.querySelector('pre');
      if (!contentDiv) return;

      const codeEl = contentDiv.querySelector("code") || contentDiv;
      if (!codeEl) return;

      const rawText = codeEl.textContent || "";
      if (!rawText.trim()) return;

      // 只要已经处理过了就跳过；流式完成时通过 dataset 判断
      if (blockEl.dataset.dshDiffProcessed === "true") return;

      const lines = rawText.split("\n");
      if (lines.length === 0) return;

      const isDiff = langText === "diff" || blockEl.dataset.codeLang === "diff" || lines.some(l => l.startsWith("diff --git") || l.startsWith("@@ "));
      if (!isDiff) return;

      blockEl.dataset.codeLang = "diff";

      // 三级递进语言自动判别：1. 首行指令 -> 2. 文件名后缀 -> 3. 语法特征打分
      let targetLang = null;
      let startIndex = 0;

      // 1. 首行指令检测 (例如 # lang: python)
      const firstLine = lines[0].trim();
      const langMatch = firstLine.match(/^(?:#|\/\/|\/\*|<!--|;|\*|--)\s*(?:lang|language|type)\s*[:=]\s*([a-zA-Z0-9_-]+)/i);
      if (langMatch) {
        targetLang = langMatch[1].toLowerCase();
        startIndex = 1;
      } else {
        // 2. 从 Git 路径标头嗅探文件名后缀
        const EXT_LANG_MAP = {
          py: "python", pyw: "python",
          js: "javascript", mjs: "javascript", cjs: "javascript", jsx: "javascript",
          ts: "typescript", tsx: "typescript",
          html: "html", htm: "html", vue: "html",
          json: "json",
          sql: "sql",
          css: "css",
          sh: "bash", bash: "bash", ps1: "powershell"
        };

        for (let i = 0; i < Math.min(lines.length, 12); i++) {
          const l = lines[i].trim();
          // 匹配 diff --git a/... b/... 或 +++ b/... 或 --- a/... 或 +++ ... 或 --- ...
          const fileMatch = l.match(/(?:diff\s+--git\s+[ab]\/.*? [ab]\/|\+\+\+\s+(?:[ab]\/)?|---\s+(?:[ab]\/)?)([\w\-\.\/]+)/i);
          if (fileMatch) {
            const ext = fileMatch[1].split('.').pop().toLowerCase();
            if (EXT_LANG_MAP[ext]) {
              targetLang = EXT_LANG_MAP[ext];
              break;
            }
          }
        }

        // 3. 启发式特征打分 (Heuristic Scoring)
        if (!targetLang) {
          let pyScore = 0;
          let jsScore = 0;
          let htmlScore = 0;

          for (const line of lines) {
            const clean = line.replace(/^[\+\-\s]+/, "").trim();
            if (!clean) continue;

            // Python 特征
            if (/\b(def|elif|import|from|self|None|True|False|async def)\b/.test(clean)) pyScore += 2;
            if (clean.endsWith(":") && /\b(if|else|for|while|try|except|with|class)\b/.test(clean)) pyScore += 3;

            // JS/TS 特征
            if (/\b(const|let|var|function|export|document|window|console\.log)\b/.test(clean)) jsScore += 2;
            if (/=>|===|!==/.test(clean)) jsScore += 3;

            // HTML 特征
            if (/<\/?[a-z][\s\S]*>/i.test(clean)) htmlScore += 3;
          }

          if (pyScore >= 3 && pyScore > jsScore) {
            targetLang = "python";
          } else if (jsScore >= 3 && jsScore > pyScore) {
            targetLang = "javascript";
          } else if (htmlScore >= 3) {
            targetLang = "html";
          }
        }
      }

      // 生成两套缓存 HTML
      const unifiedHtml = buildUnifiedHtml(lines, startIndex, targetLang);
      const splitHtml = buildSplitHtml(lines, startIndex, targetLang);

      // 默认先显示单栏
      let currentMode = "unified";
      codeEl.innerHTML = unifiedHtml;

      // 在 Banner 的 Action 区域注入 [ ◫ Split / ≡ Unified ] 切换按钮
      const actionArea = blockEl.querySelector('[data-code-block-banner] [class*="action"]');
      if (actionArea && !actionArea.querySelector('.dsh-diff-toggle-btn')) {
        const toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.className = "dsh-diff-toggle-btn";
        toggleBtn.innerHTML = `<span>◫ 分栏</span>`;
        toggleBtn.title = "切换左右分列 / 单栏显示";

        toggleBtn.addEventListener("click", () => {
          if (currentMode === "unified") {
            currentMode = "split";
            codeEl.innerHTML = splitHtml;
            toggleBtn.innerHTML = `<span>≡ 单栏</span>`;
          } else {
            currentMode = "unified";
            codeEl.innerHTML = unifiedHtml;
            toggleBtn.innerHTML = `<span>◫ 分栏</span>`;
          }
        });

        // 插入在复制按钮前
        actionArea.insertBefore(toggleBtn, actionArea.firstChild);
      }

      blockEl.dataset.dshDiffProcessed = "true";
      blockEl.dataset.dshLastText = rawText;
      console.log("[dsh-markdown-highlighter] Diff block processed successfully! targetLang:", targetLang);
    }

    function scanAllDiffs() {
      // 匹配 .md-code-block 或通用 pre/code 容器
      const codeBlocks = document.querySelectorAll('.md-code-block, pre code, [data-code-block]');
      for (const block of codeBlocks) {
        const targetBlock = block.classList.contains('md-code-block') ? block : (block.closest('.md-code-block') || block.closest('pre') || block);
        processDiffBlock(targetBlock);
      }
    }

    // 全局挂载一个手动触发接口，方便随时排查和强制重渲染
    window.__DSH_REFRESH_DIFF__ = scanAllDiffs;

    // =========================================================================
    // 5. 实时监听挂载
    // =========================================================================
    if (typeof document !== "undefined") {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", scanAllDiffs);
      } else {
        scanAllDiffs();
      }

      let timeoutId = null;
      const observer = new MutationObserver(() => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(scanAllDiffs, 60);
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    exports.apply = function () {};
    return module.exports;
  },
});