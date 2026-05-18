# 今择易 / 今擇易

今择易是一个面向中文用户的黄历、择日、八字、生肖、风水和命理知识工具站。当前版本先把确定性的黄历、八字排盘、吉日筛选、SEO 内容矩阵和解释层做扎实，AI 个性化解读暂缓到后续版本。

## 当前状态

- 技术栈：Next.js 16 App Router、React 19、TypeScript、Tailwind CSS v4、next-intl、Prisma 7、PostgreSQL、Redis、Vitest。
- 语言路由：`/zh-hans` 简体，`/zh-hant` 繁体。
- 已完成：黄历首页、日期详情、月历、节气、吉日矩阵、生肖/风水/知识内容页、八字排盘、姓名五行、个性化推荐日期工具、sitemap、robots、manifest、分享组件。
- 当前规划位置：`.planning/STATE.md` 显示 Phase 4 已完成，下一步是 Phase 5 production deployment / CI/CD。
- AI provider registry、streaming AI routes、model failover 仍是 v2 事项，不属于当前上线阻塞项。

## 本地启动

要求 Node.js 20+、npm、PostgreSQL、Redis。

```bash
npm ci
cp .env.example .env
npx prisma generate
npm run dev
```

常用命令：

```bash
npm run dev           # 本地开发
npm run typecheck     # TypeScript 检查
npm test              # Vitest
npm run lint          # ESLint
npm run build         # 生产构建
npm run start:public  # 0.0.0.0:3000 对外启动
npm run verify        # lint + typecheck + tests + build
```

## 环境变量

`.env` 不进仓库，按 `.env.example` 配置：

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/jinzeyi?schema=public"
REDIS_URL="redis://localhost:6379"
NEXT_PUBLIC_SITE_ORIGIN="https://your-domain.com"
```

`NEXT_PUBLIC_SITE_ORIGIN` 会进入 canonical、Open Graph、sitemap、robots 和分享链接。绑域名上线前设置成正式域名，然后重新 `npm run build`。

## 生产部署提示

当前服务器可直接用：

```bash
npm ci
npx prisma generate
npm run build
npm run start:public
```

若用 PM2：

```bash
pm2 start "npm run start:public" --name jinzeyi
pm2 save
```

Nginx/宝塔反代到 `http://127.0.0.1:3000`。绑定域名后记得同步更新 `NEXT_PUBLIC_SITE_ORIGIN`，否则 SEO 里的 canonical 仍会指向旧地址。

## 规划与接续

规划上下文需要随代码一起带走：

- `.planning/PROJECT.md`：产品定位、约束、需求和关键决策。
- `.planning/ROADMAP.md`：五阶段路线图。
- `.planning/STATE.md`：当前工作状态和下一步。
- `.planning/phases/**`：各阶段 discussion、research、plan、summary、validation、UI spec。
- `.planning/research/**`：早期技术和产品研究。

另一台机器接手时，建议先读：

1. `.planning/STATE.md`
2. `.planning/ROADMAP.md`
3. `.planning/phases/04-ai-integration/04-04-SUMMARY.md`
4. `README.md`
5. 需要改具体模块时再读对应 `src/**` 和 `tests/**`

## 推荐 Codex / GSD Skills

如果另一台机器继续用 Codex Skills，先确保本地 skill 环境包含或可用以下技能：

- GSD 工作流：`gsd-progress`、`gsd-discuss-phase`、`gsd-plan-phase`、`gsd-execute-phase`、`gsd-resume-work`、`gsd-health`、`gsd-docs-update`、`gsd-code-review`、`gsd-verify-work`。
- UI/产品体验：`impeccable`、`frontend-design`、`web-design-guidelines`、`polish`。
- Next/React：`next-best-practices`、`vercel-react-best-practices`、`shadcn`。
- 验证与浏览器测试：`verification-before-completion`、`webapp-testing`、`playwright`、`playwright-best-practices`。
- 后续 AI 阶段：`gsd-ai-integration-phase`、`openai-docs`。

继续阶段工作时优先用 `$gsd-progress` 看状态，再用 `$gsd-plan-phase 5` 或 `$gsd-execute-phase 5` 推进部署阶段。普通小修可以用 `$gsd-quick`，但要同步更新相关测试和规划摘要。

## Contributors

- King Hong：项目 owner、产品方向、最终决策与发布。
- Codex：AI coding assistant，参与代码实现、UI 文案审查、测试验证、规划交接文档整理。

## 代码结构

```text
src/app/                 Next.js App Router routes, sitemap, robots, manifest
src/components/          UI components for almanac, jieri, tools, SEO, sharing
src/i18n/                next-intl messages and locale helpers
src/lib/almanac/         Huangli, date range, auspicious day and scoring logic
src/lib/content/         SEO/content registries for tools, zodiac, feng shui, knowledge
src/lib/tools/           BaZi and naming calculation helpers
prisma/schema.prisma     Database schema
tests/                   Vitest coverage for almanac, SEO, i18n, tools and content
.planning/               GSD project memory and phase artifacts
```

## Git handoff

The intended GitHub remote is:

```bash
git remote add origin https://github.com/a2064777923/jinzeyi.git
git branch -M main
git push -u origin main
```

Local generated folders such as `.next/`, `node_modules/`, `.playwright-cli/`, `output/` and `.env` are intentionally ignored.
