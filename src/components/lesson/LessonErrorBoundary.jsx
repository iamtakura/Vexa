import React, { Component } from 'react'
import { AlertCircle } from 'lucide-react'

class LessonErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Console output removed to keep client-side secure for end users
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-8"
          style={{ background: 'var(--purple)' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'var(--coral-soft)' }}
          >
            <AlertCircle size={28} style={{ color: 'var(--coral)' }} />
          </div>
          <div className="text-center">
            <p className="font-fredoka text-lg font-600 mb-2">
              Something went wrong
            </p>
            <p className="font-nunito text-sm" style={{ color: 'var(--muted)' }}>
              This slide couldn't load. Tap below to go back to your journey.
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="font-nunito font-700 px-6 py-3 rounded-full text-white"
            style={{ background: 'var(--coral)' }}
          >
            Back to Journey
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default LessonErrorBoundary
