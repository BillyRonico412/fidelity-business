import { User } from "firebase/auth"
import { atom } from "jotai"
import { ToastInterface } from "./utils"

export const userAtom = atom<User | null | undefined>(undefined)
export const hiddenTabsAtom = atom<boolean>(false)
export const toastAtom = atom<ToastInterface | undefined>(undefined)
