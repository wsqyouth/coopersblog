import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumb } from '@/components/layout/Navigation'
import AvatarImage from '@/components/ui/AvatarImage'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: '关于我',
  description: '了解更多关于博主和这个博客的信息。',
}

export default function AboutPage() {
  const skills = [
    'Next.js', 'React', 'TypeScript', 'Node.js', 'Python',
    'Tailwind CSS', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker'
  ]

  const projects = [
    {
      name: '个人博客系统',
      description: '基于 Next.js 15 + React 19 构建的现代化博客',
      tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
      link: 'https://github.com/cooper/blog'
    },
    {
      name: 'Task Manager',
      description: '团队协作任务管理应用',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
      link: 'https://github.com/cooper/task-manager'
    },
    {
      name: 'API Gateway',
      description: '微服务API网关和路由系统',
      tech: ['Node.js', 'Express', 'Redis', 'Docker'],
      link: 'https://github.com/cooper/api-gateway'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <Breadcrumb items={[{ title: '关于' }]} />

        {/* 个人介绍 */}
        <div className="text-center space-y-6">
          <div className="relative w-32 h-32 mx-auto">
            <AvatarImage
              src="/images/avatar.jpg"
              alt="Cooper"
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold">👋 Hi, I'm Coopers</h1>
            <p className="text-lg text-muted-foreground mt-2">
              全栈开发工程师 · 技术写作者 · 开源爱好者
            </p>
          </div>

          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            热爱编程和技术分享，专注于现代 Web 开发技术栈。
            通过这个博客分享技术心得、项目经验和个人思考，
            希望能与更多开发者交流学习，共同成长。
          </p>
        </div>

        {/* 技能标签 */}
        <Card>
          <CardHeader>
            <CardTitle>🛠️ 技术栈</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 项目展示 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">🚀 项目作品</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <Card key={project.name} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.map(tech => (
                      <Badge key={tech} variant="outline" size="sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      查看项目
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 博客统计 */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">技术文章</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">页面访问</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary">2+</div>
              <div className="text-sm text-muted-foreground">年写作经验</div>
            </CardContent>
          </Card>
        </div>

        {/* 联系方式 */}
        <Card>
          <CardHeader>
            <CardTitle>📞 联系我</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📧</span>
                  <a 
                    href={`mailto:${siteConfig.author?.email}`}
                    className="text-primary hover:underline"
                  >
                    {siteConfig.author?.email}
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-lg">💻</span>
                  <a 
                    href="https://github.com/cooper"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub
                  </a>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🐦</span>
                  <a 
                    href="https://twitter.com/cooper"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Twitter
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-lg">💼</span>
                  <a 
                    href="https://linkedin.com/in/cooper"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 博客信息 */}
        <Card>
          <CardHeader>
            <CardTitle>ℹ️ 关于这个博客</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              这个博客使用 <strong>Next.js 15</strong> + <strong>React 19</strong> + <strong>TypeScript</strong> 构建，
              采用现代化的技术栈和最佳实践，致力于提供优秀的阅读体验。
            </p>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">主要特性</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 响应式设计</li>
                  <li>• 暗色主题支持</li>
                  <li>• SEO 优化</li>
                  <li>• 静态生成</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">技术栈</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Next.js 15 + React 19</li>
                  <li>• TypeScript + Tailwind CSS</li>
                  <li>• Markdown + Gray Matter</li>
                  <li>• Vercel 部署</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button asChild>
                <Link href="/posts">
                  开始阅读文章
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}