import { User, UserRole } from '../models/user';
import { isPasswordValid } from '../utils/validators';

const ADMIN_EMAIL = 'admin@gmail.com';

const adminUser: User & { password: string } = {
  id: 1,
  name: 'Admin User',
  email: ADMIN_EMAIL,
  password: '@Admin12345',
  role: UserRole.ADMIN,
};

const dynamicUsers: (User & { password: string })[] = [];

export const ApiService = {
  login: async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const normalizedEmail = email.toLowerCase();

        if (normalizedEmail === ADMIN_EMAIL && password === adminUser.password) {
          const { password: _, ...adminData } = adminUser;
          resolve(adminData);
          return;
        }

        const found = dynamicUsers.find( u => u.email.toLowerCase() === normalizedEmail && u.password === password );

        if (!found) {
          reject('Invalid credentials');
          return;
        }

        const { password: _, ...userData } = found;
        resolve(userData);
      }, 1000);
    });
  },

  register: async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const normalizedEmail = email.toLowerCase();

        if (normalizedEmail === ADMIN_EMAIL) {
          reject('This email is reserved for admin');
          return;
        }

        if (role === UserRole.ADMIN) {
          reject('Admin registration is not allowed');
          return;
        }

        const passwordError = isPasswordValid(password);
        if (passwordError) {
          reject(passwordError);
          return;
        }

        const exists = dynamicUsers.some(
          u => u.email.toLowerCase() === normalizedEmail
        );

        if (exists) {
          reject('Email already registered');
          return;
        }

        const newUser: User & { password: string } = {
          id: dynamicUsers.length + 2,
          name,
          email: normalizedEmail,
          password,
          role,
        };

        dynamicUsers.push(newUser);

        const { password: _, ...userData } = newUser;
        resolve(userData);
      }, 1000);
    });
  },
};
