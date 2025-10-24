// Jest setup file
import '@testing-library/jest-dom'

// Mock für Next.js Router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock für Supabase (nur wenn Modul existiert)
try {
  jest.mock('@/lib/supabase-client', () => ({
    getSupabaseBrowserClient: () => ({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } })
      }
    })
  }))
} catch (error) {
  // Ignore if module doesn't exist
}

// Mock für fetch
global.fetch = jest.fn()

// Mock für window.URL
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'mock-url'),
    revokeObjectURL: jest.fn()
  }
})

// Mock für document.createElement
const mockAnchor = {
  href: '',
  download: '',
  click: jest.fn()
}

Object.defineProperty(document, 'createElement', {
  value: jest.fn((tagName) => {
    if (tagName === 'a') {
      return mockAnchor
    }
    return {}
  })
})

Object.defineProperty(document.body, 'appendChild', {
  value: jest.fn()
})

Object.defineProperty(document.body, 'removeChild', {
  value: jest.fn()
})
