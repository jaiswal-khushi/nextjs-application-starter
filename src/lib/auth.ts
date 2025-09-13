import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key'

export interface User {
  id: string
  email: string
  name: string
}

export function generateToken(user: User): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, JWT_SECRET) as User
  } catch {
    return null
  }
}

export function getUserFromRequest(request: Request): User | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  return verifyToken(token)
}

// Demo user for testing
export const demoUser: User = {
  id: 'demo-user-id',
  email: 'demo@example.com',
  name: 'Demo User',
}
