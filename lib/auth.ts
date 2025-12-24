import bcrypt from 'bcryptjs'

// Minimal in-memory user store for demonstration.
// In production, replace with a database. Because in-memory stores don't persist,
// and users tend to expect their accounts to still exist after you restart the server.
interface User {
  id: string
  email: string
  passwordHash: string
  role: 'user' | 'admin'
}

// Demo users. Because you need something to test with, and "admin/admin" is the universal test credential.
// In production, replace with a database. Because hardcoding users is how you become a cautionary tale.
const USERS: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    passwordHash: bcrypt.hashSync('password', 10), // We hash passwords. Because storing plaintext passwords is how you become a cautionary tale.
    role: 'user',
  },
  {
    id: '2',
    email: 'admin@example.com',
    passwordHash: bcrypt.hashSync('admin', 10), // Admin password is "admin". Because this is a demo, not production.
    role: 'admin',
  },
]

/**
 * Authenticates a user by email and password. Because authentication is how you know who someone is.
 * Returns the user if credentials are valid, null otherwise. Because invalid credentials mean no user.
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<Omit<User, 'passwordHash'> | null> {
  const user = USERS.find((u) => u.email === email)

  if (!user) {
    // Generic error. Because telling attackers which emails exist in your system
    // is like giving them a roadmap to your users. We return null for both "user not found"
    // and "wrong password" to prevent user enumeration attacks.
    return null
  }

  // bcrypt comparison. Because timing attacks are real and your password check
  // shouldn't leak information about which part of the password is wrong.
  // Also, bcrypt is slow by design, which makes brute force attacks expensive.
  const isValid = await bcrypt.compare(password, user.passwordHash)

  if (!isValid) {
    // Wrong password? Return null. Because we don't want to reveal if the email exists.
    // Generic errors prevent user enumeration attacks.
    return null
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  }
}

/**
 * Gets a user by ID. Because sometimes you need to look up a user.
 * Returns null if the user doesn't exist. Because not finding a user is a valid outcome.
 */
export async function getUserById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
  const user = USERS.find((u) => u.id === id)
  
  if (!user) {
    return null
  }

  // We don't return the password hash. Because password hashes should never leave the auth layer.
  // If you need to check a password, use authenticateUser instead.
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  }
}

