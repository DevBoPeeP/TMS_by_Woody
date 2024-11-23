import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

const UserContext = React.createContext();

// do not include credentials with every request
axios.defaults.withCredentials = false;

export const UserContextProvider = ({ children }) => {
  const serverUrl = "http://localhost:5000";

  const router = useRouter();

  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [userState, setUserState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // register user
  const registerUser = async (e) => {
    e.preventDefault();
    if (
      !userState.email.includes("@") ||
      userState.password !== userState.confirmPassword ||
      userState.password.length < 6
    ) {
      toast.error("Please enter a valid email and password (min 6 characters)");
      return;
    }

    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/auth/register`,
        userState
      );
      console.log("User registered successfully", res.data);
      toast.success("User registered successfully");

      // clear the form
      setUserState({
        name: "",
        email: "",
        password: "",
      });

      // redirect to login page
      router.push("/login");
    } catch (error) {
      console.log("Error registering user", error);
      toast.error(error.response.data.message);
    }
  };
  // login the user
  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${serverUrl}/api/v1/auth/login`, {
        email: userState.email,
        password: userState.password,
      });

      toast.success("User logged in successfully");

      setUserState({ email: "", password: "" });

      await getUser(); // Refresh user details
      router.push("/"); // Redirect to dashboard
    } catch (error) {
      console.error("Error logging in user:", error);

      const errorMessage =
        error.response?.data?.message || "Failed to log in. Please try again.";

      toast.error(errorMessage);
    }
  };

  // // get user Looged in Status
  // const userLoginStatus = async () => {
  //   let loggedIn = false;
  //   try {
  //     const res = await axios.get(`${serverUrl}/api/v1/auth/login-status`);

  //     // coerce the string to boolean
  //     loggedIn = !!res.data;
  //     setLoading(false);

  //     if (!loggedIn) {
  //       router.push("/login");
  //     }
  //   } catch (error) {
  //     console.log("Error getting user login status", error);
  //   }

  //   return loggedIn;
  // };

  // logout user
  const logoutUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/logout`);

      toast.success("User logged out successfully");

      setUser({});

      // redirect to login page
      router.push("/login");
    } catch (error) {
      console.log("Error logging out user", error);
      toast.error(error.response.data.message);
    }
  };

  // get user details
  const getUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/v1/user`);

      setUser((prevState) => {
        return {
          ...prevState,
          ...res.data,
        };
      });

      setLoading(false);
    } catch (error) {
      console.log("Error getting user details", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  // update user details
  const updateUser = async (e, data) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.patch(`${serverUrl}/api/v1/user`, data);

      // update the user state
      setUser((prevState) => {
        return {
          ...prevState,
          ...res.data,
        };
      });

      toast.success("User updated successfully");

      setLoading(false);
    } catch (error) {
      console.log("Error updating user details", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const verifyOtp = async (otp) => {
    setLoading(true);
    try {
      const verificationToken = sessionStorage.getItem("verificationToken");

      const response = await axios.post(
        "/api/v1/auth/verify-email",
        { otp } // Request body
      );

      const data = response.data;

      // Save the access token in local storage
      localStorage.setItem("accessToken", data.accessToken);

      // Save the access token in the context
      setAccessToken(data.accessToken);

      // Redirect the user to the dashboard
      router.push("/");

      console.log(data);
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  // forgot password email
  const forgotPasswordEmail = async (email) => {
    setLoading(true);

    try {
      const res = await axios.post(`${serverUrl}/api/v1/auth/forgot-password`, {
        email,
      });

      toast.success("Forgot password email sent successfully");
      setLoading(false);
    } catch (error) {
      console.log("Error sending forgot password email", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // reset password
  const resetPassword = async (token, password) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/auth/reset-password/${token}`,
        {
          password,
        }
      );

      toast.success("Password reset successfully");
      setLoading(false);
      // redirect to login page
      router.push("/login");
    } catch (error) {
      console.log("Error resetting password", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // change password
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);

    try {
      const res = await axios.patch(
        `${serverUrl}/api/v1/auth/change-password`,
        { currentPassword, newPassword }
      );

      toast.success("Password changed successfully");
      setLoading(false);
    } catch (error) {
      console.log("Error changing password", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // admin routes
  const getAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/v1/auth/admin/users`, {});

      setAllUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error getting all users", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // dynamic form handler
  const handlerUserInput = (name) => (e) => {
    const value = e.target.value;

    setUserState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // delete user
  const deleteUser = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `${serverUrl}/api/v1/auth/admin/users/${id}`,
        {}
      );

      toast.success("User deleted successfully");
      setLoading(false);
      // refresh the users list
      getAllUsers();
    } catch (error) {
      console.log("Error deleting user", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const loginStatusGetUser = async () => {
  //     const isLoggedIn = await userLoginStatus();

  //     if (isLoggedIn) {
  //       await getUser();
  //     }
  //   };

  //   loginStatusGetUser();
  // }, []);

  useEffect(() => {
    if (user.role === "admin") {
      getAllUsers();
    }
  }, [user.role]);

  return (
    <UserContext.Provider
      value={{
        registerUser,
        userState,
        handlerUserInput,
        loginUser,
        logoutUser,
        // userLoginStatus,
        user,
        updateUser,
        verifyOtp,
        forgotPasswordEmail,
        resetPassword,
        changePassword,
        allUsers,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
