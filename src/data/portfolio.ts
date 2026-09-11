export interface Project {
  id: string
  title: string
  category: string
  description: string
  tech: string[]
  url: string
  position: { x: number; y: number }
  highlights: string[]
}

export interface LinkGroup {
  title: string
  links: { title: string; detail: string; url: string }[]
}

export const personalProfile = {
  name: 'TFGKK',
  headline: '这个人很懒，什么都没有留下....',
  summary: '项目、算法、工具。',
  focus: ['算法竞赛', '全栈开发', '实用工具'],
  links: [
    { title: 'GitHub', url: 'https://github.com/tongfengguan' },
    { title: 'Codeforces', url: 'https://codeforces.com/profile/tfgkk' },
    { title: 'Email', url: 'mailto:1316187067@qq.com' },
  ],
}

export const projects: Project[] = [
  {
    id: 'ningning',
    title: 'NingNing AI',
    category: 'Conversational assistant',
    description: 'A conversational assistant with long-term memory, semantic search, and vision.',
    tech: ['Python', 'DeepSeek-V3', 'RAG', 'FastAPI'],
    url: 'https://github.com/Tongfengguan/LingDiNingNing_talkbot',
    position: { x: 250, y: 175 },
    highlights: ['Long-term memory', 'Semantic retrieval', 'Visual recognition'],
  },
  {
    id: 'farmer',
    title: 'Farmer Platform',
    category: 'Full-stack application',
    description:
      'Policy information, workflow tools, and data visualization for smart agriculture.',
    tech: ['Java 21', 'Spring Boot', 'Vue 3'],
    url: 'https://github.com/tongfengguan/FarmerPlatform',
    position: { x: 720, y: 265 },
    highlights: ['Policy information', 'Workflow management', 'Data visualization'],
  },
  {
    id: 'competition',
    title: 'Competition Manager',
    category: 'Competition system',
    description: 'A competition workflow with secure registration and asynchronous data export.',
    tech: ['Spring Boot 3', 'Vue 3', 'MySQL'],
    url: 'https://github.com/tongfengguan/SchoolCompetitionWeb',
    position: { x: 610, y: 510 },
    highlights: ['Secure registration', 'Competition workflows', 'Asynchronous export'],
  },
]

export const technologies = [
  {
    name: 'Python',
    position: { x: 105, y: 80 },
    description: 'The language behind the assistant and its application logic.',
  },
  {
    name: 'DeepSeek-V3',
    position: { x: 320, y: 55 },
    description: 'The language model used by NingNing AI.',
  },
  {
    name: 'RAG',
    position: { x: 100, y: 300 },
    description: 'Retrieval brings relevant memories and context into a conversation.',
  },
  {
    name: 'FastAPI',
    position: { x: 430, y: 165 },
    description: 'The Python API framework used in the assistant.',
  },
  {
    name: 'Java 21',
    position: { x: 850, y: 90 },
    description: 'The Java runtime used by Farmer Platform.',
  },
  {
    name: 'Vue 3',
    position: { x: 790, y: 410 },
    description: 'A shared frontend framework across the two web applications.',
  },
  {
    name: 'Spring Boot',
    position: { x: 885, y: 295 },
    description: 'The backend framework shared by the agriculture and competition systems.',
  },
  {
    name: 'MySQL',
    position: { x: 815, y: 575 },
    description: 'The relational database used by Competition Manager.',
  },
]

export const linkGroups: LinkGroup[] = [
  {
    title: 'Daily tools',
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
