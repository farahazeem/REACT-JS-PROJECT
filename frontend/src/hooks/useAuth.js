import { useContext, createContext, useState } from "react";
import { toast } from "react-toastify";
import * as userService from "../services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userService.getUser());

  const login = async (email, password) => {
    try {
      const user = await userService.login(email, password);
      setUser(user);
      toast.success("Login successful");
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const register = async (data) => {
    try {
      const user = await userService.register(data);
      setUser(user);
      toast.success("Register successful");
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const logout = () => {
    userService.logout();
    setUser(null);
    toast.success("Logout successful");
  };

  const updateProfile = async (user) => {
    try {
      const updatedUser = await userService.updateProfile(user);
      toast.success("Profile updated successful");
      if (updatedUser) setUser(updatedUser);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const changePassword = async (passwords) => {
    try {
      await userService.changePassword(passwords);
      logout();
      toast.success("Password changed successful, Please login again");
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, updateProfile, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
