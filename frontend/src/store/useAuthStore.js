import {create} from "zustand"
import { axiosInstance } from "../lib/axios"


export const useAuthStore = create((set) => ({
    //initial count will be null coz we don't know whether the user is auth. or not
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdateingProfile: false,
    
    //initially it will be true coz as soon as we refresh the page we will check the user
    //is authenticated or ot
    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({authUser:res.data})
        } catch (error) {
            console.log("Error in checkAuth:",error);
            set({authUser:null})
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {}

}))