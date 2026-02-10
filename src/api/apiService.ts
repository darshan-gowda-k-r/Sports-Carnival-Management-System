import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, StoredUser, UserRole, Gender } from '../models/user';
import { isPasswordValid } from '../utils/validators';
import { validationStrings } from '../constants/validationStrings';

const USERS_KEY = 'USERS_DATA';

const initializeUsers = async () => {
  try {
    const existingUsers = await AsyncStorage.getItem(USERS_KEY);
    if (!existingUsers) {
      const adminUser: StoredUser = {
        id: 'admin@gmail.com',
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'Admin@12345',
        role: UserRole.ADMIN,
        gender: Gender.OTHER,
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify([adminUser]));
    }
  } catch (error) {
    console.error(validationStrings.INIT_USERS_ERROR, error);
  }
};

const getStoredUsers = async (): Promise<StoredUser[]> => {
  try {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(validationStrings.GET_USERS_ERROR, error);
    return [];
  }
};

const saveUsers = async (users: StoredUser[]) => {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error(validationStrings.SAVE_USERS_ERROR, error);
    throw new Error(validationStrings.SAVE_USERS_FAILED);
  }
};

export const ApiService = {
  initialize: async () => {
    await initializeUsers();
  },

  login: async (email: string, password: string): Promise<User> => {
    const users = await getStoredUsers();

    const userFound = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );

    if (!userFound) {
      throw new Error(validationStrings.INVALID_CREDENTIALS);
    }

    const { password: _, ...userData } = userFound;
    return userData;
  },

  register: async (
    name: string,
    email: string,
    password: string,
    role: UserRole.ORGANIZER | UserRole.PARTICIPANT,
    gender?: Gender
  ): Promise<User> => {
    const passwordError = isPasswordValid(password);
    if (passwordError) {
      throw new Error(passwordError);
    }

    const users = await getStoredUsers();

    const userExists = users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
    if (userExists) {
      throw new Error(validationStrings.EMAIL_EXISTS);
    }

    if (role === UserRole.ADMIN) {
      throw new Error(validationStrings.ADMIN_REG_FORBIDDEN);
    }

    if (email.toLowerCase() === validationStrings.ADMIN_EMAIL.toLowerCase()) {
      throw new Error(validationStrings.RESERVED_EMAIL);
    }

    const newUser: StoredUser = {
      id: email.toLowerCase(),
      name,
      email: email.toLowerCase(),
      password,
      role,
      gender,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await saveUsers(users);

    const { password: _, ...userData } = newUser;
    return userData;
  },

  getAllUsers: async (): Promise<User[]> => {
    const users = await getStoredUsers();
    return users.map(({ password, ...user }) => user);
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
    const users = await getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    const { password, ...userData } = user;
    return userData;
  },

  updateUser: async (email: string, updates: Partial<User>): Promise<User> => {
    const users = await getStoredUsers();
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
      throw new Error(validationStrings.USER_NOT_FOUND);
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      email: users[userIndex].email,
      id: users[userIndex].id,
    };

    await saveUsers(users);

    const { password, ...userData } = users[userIndex];
    return userData;
  },

  deleteUser: async (email: string): Promise<void> => {
    if (email.toLowerCase() === validationStrings.ADMIN_EMAIL.toLowerCase()) {
      throw new Error(validationStrings.DELETE_ADMIN_FORBIDDEN);
    }

    const users = await getStoredUsers();
    const filteredUsers = users.filter((u) => u.email.toLowerCase() !== email.toLowerCase());
    await saveUsers(filteredUsers);
  },

  changePassword: async (email: string, oldPassword: string, newPassword: string): Promise<void> => {
    const users = await getStoredUsers();
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
      throw new Error(validationStrings.USER_NOT_FOUND);
    }

    if (users[userIndex].password !== oldPassword) {
      throw new Error(validationStrings.INVALID_CURRENT_PASSWORD);
    }

    const passwordError = isPasswordValid(newPassword);
    if (passwordError) {
      throw new Error(passwordError);
    }

    users[userIndex].password = newPassword;
    await saveUsers(users);
  },
};

