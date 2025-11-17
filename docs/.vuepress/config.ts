import { defineUserConfig, defaultTheme } from 'vuepress'
import { searchPlugin } from '@vuepress/plugin-search'

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'ADI Writer - 部署与使用指南',
  description: 'AI驱动的创意写作助手 - Vercel部署指南、API文档、常见问题解答',
  base: '/docs/',
  
  theme: defaultTheme({
    logo: '/logo.png',
    docsDir: 'src',
    docsBranch: 'main',
    editLink: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdatedText: '最后更新时间',
    contributorsText: '贡献者',
    
    navbar: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: '指南',
        children: [
          {
            text: '快速开始',
            link: '/guide/quickstart.html',
          },
          {
            text: 'Vercel部署',
            link: '/guide/vercel-deployment.html',
          },
          {
            text: '本地开发',
            link: '/guide/local-development.html',
          },
          {
            text: '环境配置',
            link: '/guide/environment.html',
          },
        ],
      },
      {
        text: 'API',
        children: [
          {
            text: 'API文档',
            link: '/api/overview.html',
          },
          {
            text: '端点列表',
            link: '/api/endpoints.html',
          },
          {
            text: '错误处理',
            link: '/api/errors.html',
          },
        ],
      },
      {
        text: '常见问题',
        link: '/faq/index.html',
      },
      {
        text: '架构',
        link: '/architecture/index.html',
      },
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: '快速开始',
          children: [
            '/guide/quickstart.md',
            '/guide/requirements.md',
          ],
        },
        {
          text: '部署',
          children: [
            '/guide/vercel-deployment.md',
            '/guide/environment.md',
            '/guide/deployment-checklist.md',
          ],
        },
        {
          text: '开发',
          children: [
            '/guide/local-development.md',
            '/guide/project-structure.md',
          ],
        },
      ],
      '/api/': [
        {
          text: 'API 文档',
          children: [
            '/api/overview.md',
            '/api/endpoints.md',
            '/api/errors.md',
            '/api/rate-limiting.md',
          ],
        },
      ],
      '/faq/': [
        '/faq/index.md',
        '/faq/common-issues.md',
        '/faq/troubleshooting.md',
      ],
      '/architecture/': [
        '/architecture/index.md',
        '/architecture/backend.md',
        '/architecture/frontend.md',
      ],
    },
  }),
  
  plugins: [
    searchPlugin({
      locales: {
        '/': {
          placeholder: '搜索文档',
        },
      },
    }),
  ],
})
