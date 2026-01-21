import { User, UserRole } from '../models/user';
import { isPasswordValid } from '../utils/validators';
import { validationStrings } from '../constants/validationStrings';

const dynamicUsers: (User & { password: string })[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'Admin@12345',
    role: UserRole.ADMIN,
  },
];

export const ApiService = {
  login: async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = dynamicUsers.find(
          u => u.email === email && u.password === password
        );

        if (!found) {
          reject(validationStrings.INVALID_CREDENTIALS);
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
    role: UserRole.ORGANIZER | UserRole.PARTICIPANT
  ): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const passwordError = isPasswordValid(password);
        if (passwordError) {
          reject(passwordError);
          return;
        }

        const exists = dynamicUsers.some(u => u.email === email);

        if (exists) {
          reject(validationStrings.EMAIL_EXISTS);
          return;
        }

        const newUser: User & { password: string } = {
          id: dynamicUsers.length + 1,
          name,
          email: email,
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