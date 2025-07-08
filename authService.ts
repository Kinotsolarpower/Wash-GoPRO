
import { User, UserRole } from '../types';

type StoredUser = Omit<User, 'role'> & { passwordHash: string };

const USERS_KEY = 'washgo_pro_users';
const SESSION_KEY = 'washgo_pro_session';

// --- Mock Database ---
// In a real app, this would be a backend API call.
const getStoredUsers = (): StoredUser[] => {
  try {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error("Failed to retrieve users:", error);
    return [];
  }
};

const saveStoredUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Initialize with a default admin user if one doesn't exist
const initializeAdmin = () => {
    const users = getStoredUsers();
    
    if (!users.some(u => u.email === 'admin@washgo.pro')) {
        users.push({
            firstName: 'Admin', lastName: 'User', email: 'admin@washgo.pro',
            passwordHash: 'admin', address: '123 Admin Ave, New York, NY 10001', phone: '555-0100',
        });
    }
    
    if (!users.some(u => u.email === 'superadmin@washgo.pro')) {
        users.push({
            firstName: 'Super', lastName: 'Admin', email: 'superadmin@washgo.pro',
            passwordHash: 'superadmin', address: '1 Super Admin Way, San Francisco, CA 94102', phone: '555-0199',
        });
    }

    if (!users.some(u => u.email === 'tech@washgo.pro')) {
        users.push({
            firstName: 'Tech', lastName: 'Nichan', email: 'tech@washgo.pro',
            passwordHash: 'tech', address: 'On The Road', phone: '555-0101',
        });
    }

    saveStoredUsers(users);
};

initializeAdmin();

// --- Authentication Service ---
export const authService = {
  getCurrentUser: (): User | null => {
    try {
      const sessionJson = localStorage.getItem(SESSION_KEY);
      return sessionJson ? JSON.parse(sessionJson) : null;
    } catch (error) {
      console.error("Failed to retrieve session:", error);
      return null;
    }
  },

  login: (email: string, password_sent: string): User | null => {
    const users = getStoredUsers();
    const userFound = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // FIXED: Made logic more robust to prevent crashes.
    if (!userFound) {
      // Special hardcoded fallback for tech user, in case local storage is cleared
      if (email.toLowerCase() === 'tech@washgo.pro' && password_sent === 'tech') {
          const techUser: User = { 
              firstName: 'Tech', lastName: 'Nichan', email: 'tech@washgo.pro',
              address: 'On The Road', phone: '555-0101', role: UserRole.TECHNICIAN 
          };
          localStorage.setItem(SESSION_KEY, JSON.stringify(techUser));
          return techUser;
      }
      return null; // User not found, and not the special tech user.
    }

    // Now that we know userFound exists, we can safely check the password.
    if (password_sent !== userFound.passwordHash) {
        return null; // Incorrect password for found user
    }
    
    // Correct password
    let role = UserRole.CUSTOMER;
    if (userFound.email === 'superadmin@washgo.pro') role = UserRole.SUPER_ADMIN;
    else if (userFound.email === 'admin@washgo.pro') role = UserRole.ADMIN;
    else if (userFound.email === 'tech@washgo.pro') role = UserRole.TECHNICIAN;

    const { passwordHash, ...userToStore } = userFound;
    const sessionUser: User = { ...userToStore, role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  register: (userData: Omit<User, 'role'> & { password_sent: string }): User | null => {
    const users = getStoredUsers();
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        return null; // User already exists
    }
    
    const newUser: StoredUser = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        address: userData.address,
        phone: userData.phone,
        passwordHash: userData.password_sent, // Mock hash
    };
    
    users.push(newUser);
    saveStoredUsers(users);
    
    const { passwordHash, ...userToStore } = newUser;
    const sessionUser: User = { ...userToStore, role: UserRole.CUSTOMER };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  // For admin panel and other services usage
  getUserByEmail: (email: string): User | null => {
    const users = getStoredUsers();
    const userFound = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!userFound) return null;
    
    let role = UserRole.CUSTOMER;
    if (userFound.email === 'admin@washgo.pro') role = UserRole.ADMIN;
    else if (userFound.email === 'superadmin@washgo.pro') role = UserRole.SUPER_ADMIN;
    else if (userFound.email === 'tech@washgo.pro') role = UserRole.TECHNICIAN;
    
    const { passwordHash, ...user } = userFound;
    return { ...user, role };
  },

  getAllUsers: (): User[] => {
    const storedUsers = getStoredUsers();
    return storedUsers.map(u => {
      let role = UserRole.CUSTOMER;
      if (u.email === 'admin@washgo.pro') role = UserRole.ADMIN;
      else if (u.email === 'superadmin@washgo.pro') role = UserRole.SUPER_ADMIN;
      else if (u.email === 'tech@washgo.pro') role = UserRole.TECHNICIAN;
      const { passwordHash, ...user } = u;
      return { ...user, role };
    });
  }
};
