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
    fullName: "",
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
    console.log(userState);
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/auth/register`,
        userState
      );
      console.log("User registered successfully", res.data);
      sessionStorage.setItem("verificationToken", res.data.verificationToken);
      toast.success("User registered successfully");

      // clear the form
      setUserState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // redirect to email verification page
      router.push("/verify-email");
    } catch (error) {
      // Handle potential errors from the API call
      if (error.response && error.response.data) {
        toast.error(error.response.data.message); // Use specific error message from response
      } else {
        console.log("Error registering user", error.message);
        toast.error("Failed to register user. Please try again.");
      }
    }
  };

  const verifyOtp = async (otp) => {
    setLoading(true);
    console.log("inside verifyOtp");
    try {
      const verificationToken = sessionStorage.getItem("verificationToken");
      const res = await axios.post(
        `${serverUrl}/api/v1/auth/verify-email`,
        { otp }, // Request body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              verificationToken ? verificationToken : ""
            }`,
          },
        }
      );

      console.log("User verification successful", res.data);
      sessionStorage.setItem("accessToken", res.data.accessToken);
      toast.success("User verification successful");

      // Redirect the user to the dashboard
      router.push("/");

      console.log(data);
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  // login the user
  const loginUser = async (e) => {
    e.preventDefault();
    console.log("Inside loginUser");
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/auth/login`,
        {
          email: userState.email,
          password: userState.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken ? accessToken : ""}`,
          },
        }
      );

      console.log("User logged in successfully", res.data);
      toast.success("User logged in successfully");

      setUserState({ email: "", password: "" });

      await getUser(); // Refresh user details
      router.push("/"); // Redirect to dashboard
    } catch (error) {
      const errorMessage = "Failed to log in. Please try again.";
      console.log("Error logging in user:", errorMessage);

      toast.error(error);
    }
  };

  const userLoginStatus = async () => {
    let loggedIn = false;
    try {
      const res = await axios.get(`${serverUrl}/api/v1/login-status`);

      // coerce the string to boolean
      loggedIn = !!res.data;
      setLoading(false);

      if (!loggedIn) {
        router.push("/login");
      }
    } catch (error) {
      console.log("Error getting user login status", error);
    }

    return loggedIn;
  };

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
      toast.error("failed");
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
      toast.error("cannot get details");
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
      toast.error("cannot update details");
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
      toast.error("Error sending forgot password email");
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
      toast.error("Error resetting password");
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
      toast.error("Error changing password");
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
      toast.error("Error getting all users");
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
      toast.error("Error deleting user");
      setLoading(false);
    }
  };

  useEffect(() => {
    const loginStatusGetUser = async () => {
      const isLoggedIn = await userLoginStatus();

      if (isLoggedIn) {
        await getUser();
      }
    };

    loginStatusGetUser();
  }, []);

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
