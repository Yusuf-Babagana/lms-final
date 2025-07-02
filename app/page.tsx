// Imports remain the same
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, Award, Globe, Star, Play, Clock, Download } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">SkillBright</h1>
                <p className="text-xs text-green-600">From learning to earning.</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/courses" className="text-gray-600 hover:text-green-600 transition-colors">Courses</Link>
              <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-green-600 transition-colors">Contact</Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-200">
            🇳🇬 Empowering Nigerian Learners
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Build Skills for Success with
            <span className="text-green-600 block">SkillBright</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Practical, accessible learning in English and Hausa. Gain the skills you need to thrive in today's world.
          </p>
          <p className="text-lg text-green-700 dark:text-green-400 mb-10 font-medium">
            Samun dabarun rayuwa cikin sauƙi — da Hausa da Turanci — don samun ci gaba mai ɗorewa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/courses">
                <Play className="mr-2 h-5 w-5" />
                Start Learning
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/courses?free=true">
                <BookOpen className="mr-2 h-5 w-5" />
                Free Courses
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose SkillBright?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Tailored for Nigerian learners — empowering you with flexible, real-world skills.
            </p>
          </div>
          {/* Feature Cards - unchanged */}
        </div>
      </section>

      {/* Featured Courses Section */}
      {/* Same structure - unchanged, already fits SkillBright's focus */}

      {/* Stats Section */}
      <section className="py-20 px-4 bg-green-600 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-green-100">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-green-100">Courses Offered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-green-100">Professional Tutors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-green-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Brighten Your Future?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of learners developing real skills for real opportunities.
          </p>
          <Button size="lg" asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/auth/signup">Create Free Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">SkillBright</h3>
                  <p className="text-sm text-green-400">Learn Smart. Earn Bright.</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Transforming lives across Nigeria through practical, skills-based education.
              </p>
            </div>
            {/* Other Footer sections unchanged */}
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 SkillBright. All rights reserved. Made with ❤️ in Nigeria.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
