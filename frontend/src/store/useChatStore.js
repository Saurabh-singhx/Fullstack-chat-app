import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import user from "../../../backend/src/models/user.model";
import { use } from "react";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  searchedUser: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/auth/contacts");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getSearchedUser: async (data) => {
    const { searchedUser } = get();
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get(`/auth/searchcontacts`, {
        params: { searchID: data },
      });

      set({ searchedUser: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  addSearchedContact: async (email) => {

    const { users } = get();
    const { searchedUser } = get();
    try {
      const res = await axiosInstance.post("/auth/addcontact", { email });
      // const alreadyExists = users.some((u) => u._id === searchedUser._id);

      const currdata = res.data.contacts;
      // console.log("currdata", currdata);
      // console.log(users, "users");
      if(!currdata || currdata.length === 0) {
        set({ users: [...users,currdata] });
      }
      // console.log(users, "users after adding contact");
      // console.log("res.data", res.data.contacts);
      toast.success("Contact added successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ searchedUser: '' });
    }
  },


  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/chat/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));