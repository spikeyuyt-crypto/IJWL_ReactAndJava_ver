import { create } from 'zustand';

export type AvatarType =
  | 'Icon1'
  | 'Icon2'
  | 'Icon3'
  | 'Icon4'
  | 'Icon5'

type UserStatusInfo = {
  userId: number | null;
  userName: string | null;
  backgroundColor: string | null;
  fontSize: string | null;
};

type UserStatusStore = {
  isLoggedIn: boolean;
  user: UserStatusInfo | null;
  avatar: AvatarType | null;
  darkMode: boolean;
  login: (user: UserStatusInfo) => void;
  logout: () => void;
  changeAvatar: (avatar: AvatarType) => void;
  switchDarkMode: () => void
  setThemeColor: (color: string) => void
}


export const useUserStatusStore = create<UserStatusStore>((set) => ({
  isLoggedIn: false,
  user: null,
  avatar: "Icon1",
  darkMode: false,
  switchDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  login: (user: UserStatusInfo) => set({ isLoggedIn: true, user: user }),
  logout: () => set({ isLoggedIn: false, user: null }),
  changeAvatar: (avatar: AvatarType) => set({ avatar }),
  setThemeColor: (color: string) => set((state) => ({
    user: state.user
      ? {
        ...state.user,
        backgroundColor: color
      }
      : {
        userId: null,
        userName: null,
        fontSize: null,
        backgroundColor: color,
      }

  }))
}));
