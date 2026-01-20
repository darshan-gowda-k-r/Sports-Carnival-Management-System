import { User, UserRole } from '../models/User';

const adminUser: User & { password: string } = {
  id: 1,
  name: 'Admin User',
  email: 'admin@gmail.com',
  password: '123456',
  role: UserRole.ADMIN,
};

const dynamicUsers: (User & { password: string })[] = [];

export const ApiService = {
  login: async (email: string, password: string, role?: UserRole): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (role === UserRole.ADMIN) {
          if (email === adminUser.email && password === adminUser.password) {
            resolve({ id: adminUser.id, name: adminUser.name, email: adminUser.email, role: adminUser.role });
          } else {
            reject('Invalid admin credentials');
          }
          return;
        }

        const found = dynamicUsers.find(u => u.email === email && u.password === password && u.role === role);
        if (found) {
          resolve({ id: found.id, name: found.name, email: found.email, role: found.role });
        } else {
          reject('Invalid credentials');
        }
      }, 1000);
    });
  },

  register: async (name: string, email: string, password: string, role: UserRole = UserRole.PARTICIPANT): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exists = dynamicUsers.some(u => u.email === email) || (role === UserRole.ADMIN && email === adminUser.email);
        if (exists) {
          reject('Email already registered');
          return;
        }

        const newUser: User & { password: string } = {
          id: dynamicUsers.length + 2,
          name,
          email,
          password,
          role,
        };
        dynamicUsers.push(newUser);
        resolve({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });
      }, 1000);
    });
  },
};
