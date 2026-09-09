export interface Project {
  title: string
  category: string
  description: string
  tech: string[]
  url: string
}

export interface LinkGroup {
  title: string
  links: { title: string; detail: string; url: string }[]
}

export const projects: Project[] = [
  {
    title: 'NingNing AI',
    category: 'AI assistant',
    description: 'A conversational assistant with long-term memory, semantic search, and vision.',
    tech: ['Python', 'DeepSeek-V3', 'RAG', 'FastAPI'],
    url: 'https://github.com/Tongfengguan/LingDiNingNing_talkbot',
  },
  {
    title: 'Farmer Platform',
    category: 'Full-stack application',
    description:
      'Policy information, workflow tools, and data visualization for smart agriculture.',
    tech: ['Java 21', 'Spring Boot', 'Vue 3'],
    url: 'https://github.com/tongfengguan/FarmerPlatform',
  },
  {
    title: 'Competition Manager',
    category: 'Competition system',
    description: 'A competition workflow with secure registration and asynchronous data export.',
    tech: ['Spring Boot 3', 'Vue 3', 'MySQL'],
    url: 'https://github.com/tongfengguan/SchoolCompetitionWeb',
  },
]

export const linkGroups: LinkGroup[] = [
  {
    title: 'Intelligence',
    links: [
      { title: 'Claude', detail: 'Anthropic', url: 'https://claude.ai/' },
      { title: 'Gemini', detail: 'Google', url: 'https://gemini.google.com/' },
      { title: 'ChatGPT', detail: 'OpenAI', url: 'https://chat.openai.com/' },
    ],
  },
  {
    title: 'Competitive',
    links: [
      { title: 'Codeforces', detail: 'Contests', url: 'https://codeforces.com/' },
      { title: 'AtCoder', detail: 'Contests', url: 'https://atcoder.jp/' },
      { title: 'Nowcoder', detail: 'Practice', url: 'https://ac.nowcoder.com/' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { title: 'GitHub', detail: 'Source code', url: 'https://github.com/tongfengguan' },
      { title: 'Email', detail: 'Get in touch', url: 'mailto:1316187067@qq.com' },
    ],
  },
]
