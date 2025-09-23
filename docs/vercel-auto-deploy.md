# Vercel 自动部署配置指南

## 📋 配置步骤

### 1. 获取 Vercel 配置信息

#### 获取 Vercel Token
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击右上角头像 → Settings
3. 左侧菜单选择 "Tokens"
4. 点击 "Create Token"
5. 输入 Token 名称（如：`cooper-blog-deploy`）
6. 复制生成的 Token（只显示一次，请妥善保存）

#### 获取 Project ID 和 Org ID
```bash
# 在项目根目录运行
npx vercel
# 按提示完成项目关联

# 查看 .vercel/project.json 文件
cat .vercel/project.json
```

你会看到类似内容：
```json
{
  "projectId": "prj_xxxxxxxxxxxxxxxxxxxx",
  "orgId": "team_xxxxxxxxxxxxxxxxxxxx"
}
```

### 2. 配置 GitHub Secrets

#### 在 GitHub 仓库中设置 Secrets
1. 进入 GitHub 仓库页面
2. 点击 "Settings" 选项卡
3. 左侧菜单选择 "Secrets and variables" → "Actions"
4. 点击 "New repository secret" 添加以下三个 secrets：

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VERCEL_TOKEN` | Vercel API Token | `abcd1234efgh5678...` |
| `PROJECT_ID` | Vercel 项目 ID | `prj_xxxxxxxxxxxxxxxxxxxx` |
| `ORG_ID` | Vercel 组织 ID | `team_xxxxxxxxxxxxxxxxxxxx` |

### 3. 验证配置

#### 测试自动部署
1. **提交代码触发部署**
   ```bash
   # 添加一个测试文件
   echo "# 测试自动部署" > test-deploy.md
   git add test-deploy.md
   git commit -m "test: trigger auto deploy"
   git push origin main
   ```

2. **查看部署状态**
   - GitHub: 仓库页面 → Actions 选项卡
   - Vercel: Dashboard → 项目页面 → Deployments

3. **手动触发部署**
   - GitHub 仓库 → Actions → "Deploy to Vercel" → "Run workflow"

## 🚀 工作流程说明

### 自动触发条件
- ✅ 推送到 `main` 分支
- ✅ 手动在 GitHub Actions 中触发

### 部署流程
```
代码推送 → GitHub Actions 检测 → 安装依赖 → 构建项目 → 部署到 Vercel → 完成
```

### 部署时间
- 通常 2-4 分钟完成
- 构建时间取决于项目大小和依赖数量

## 🔧 高级配置

### 条件部署
如果只想在特定条件下部署，可以修改 `.github/workflows/vercel-deploy.yml`：

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'posts/**'      # 只在文章变更时部署
      - 'src/**'        # 或代码变更时部署
      - 'package.json'  # 或依赖变更时部署
```

### 环境变量
如果需要在构建时传递环境变量：

```yaml
- name: Build project
  run: npm run build
  env:
    NODE_ENV: production
    NEXT_PUBLIC_SITE_URL: https://your-domain.vercel.app
```

### 部署预览环境
创建 PR 时自动部署预览环境：

```yaml
# 在 vercel-deploy.yml 中添加
on:
  pull_request:
    branches: [main]

# 在 Deploy 步骤中移除 --prod 参数
vercel-args: ''  # 这将部署到预览环境
```

## ⚠️ 注意事项

### 安全性
- ✅ Token 存储在 GitHub Secrets 中，不会暴露
- ✅ 只有推送到 main 分支才会触发生产部署
- ⚠️ 定期更新 Vercel Token（建议 3-6 个月）

### 配额限制
- Vercel Free Plan: 100 deployments/month
- GitHub Actions: 2000 minutes/month (免费用户)

### 故障排除

#### 常见错误
1. **Token 无效**
   ```
   Error: Invalid token
   ```
   解决：重新生成 Vercel Token 并更新 GitHub Secret

2. **Project ID 错误**
   ```
   Error: Project not found
   ```
   解决：检查 PROJECT_ID 是否正确

3. **构建失败**
   ```
   Error: Command "npm run build" exited with 1
   ```
   解决：本地运行 `npm run build` 检查错误

#### 调试方法
1. 查看 GitHub Actions 日志
2. 检查 Vercel Dashboard 构建日志
3. 本地运行构建命令验证

## 📚 相关链接

- [Vercel CLI 文档](https://vercel.com/docs/cli)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vercel API 文档](https://vercel.com/docs/rest-api)

## 🎯 完成后的效果

配置完成后，每次你：
1. 添加新文章到 `posts/` 目录
2. 提交并推送到 GitHub
3. GitHub Actions 自动构建并部署到 Vercel
4. 2-4 分钟后新文章自动上线

这样就实现了**真正的自动化部署**！🎉