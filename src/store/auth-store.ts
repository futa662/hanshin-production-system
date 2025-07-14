import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// 仮のユーザーデータベース
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: '管理者',
    role: 'admin' as const,
  },
  {
    id: '2',
    username: 'operator01',
    password: 'pass123',
    name: '田中太郎',
    role: 'operator' as const,
  },
  {
    id: '3',
    username: 'viewer01',
    password: 'view123',
    name: '山田花子',
    role: 'viewer' as const,
  },
];

// クッキーを設定する関数
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }
};

// クッキーを削除する関数
const deleteCookie = (name: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        
        // 仮の認証処理
        const user = MOCK_USERS.find(
          (u) => u.username === username && u.password === password
        );

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true });
          
          // クッキーにも認証状態を保存
          const authData = {
            state: {
              user: userWithoutPassword,
              isAuthenticated: true
            }
          };
          setCookie('auth-storage', JSON.stringify(authData));
          
          return true;
        }

        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        deleteCookie('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          // Cookieから読み取り
          if (typeof window === 'undefined') return null;
          const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
          if (match) {
            try {
              return JSON.parse(decodeURIComponent(match[2]));
            } catch (e) {
              return null;
            }
          }
          // フォールバックとしてlocalStorageも確認
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          // Cookieに保存
          const stringValue = JSON.stringify(value);
          setCookie(name, stringValue);
          // localStorageにも保存（フォールバック）
          if (typeof window !== 'undefined') {
            localStorage.setItem(name, stringValue);
          }
        },
        removeItem: (name) => {
          // Cookieから削除
          deleteCookie(name);
          // localStorageからも削除
          if (typeof window !== 'undefined') {
            localStorage.removeItem(name);
          }
        },
      },
    }
  )
);