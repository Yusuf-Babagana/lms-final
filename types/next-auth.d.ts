import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      language: string
      avatar?: string
    }
  }

  interface User {
    role: string
    language: string
    avatar?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    language: string
  }
}