import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Shared "Continue with Google" logic for the Login & Register pages.
 *
 * Returns:
 *   - googleLogin(): trigger the Google popup
 *   - isGoogleLoading: true while the popup / backend request is in flight
 *
 * Flow: Google popup -> access_token -> POST /api/auth/google (cookie set by
 * backend) -> update AuthContext -> redirect (admins go to /admin).
 */
export const useGoogleAuth = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const sendToBackend = async (access_token) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        login(data.user);
        toast.success("Welcome to BuyZone!");
        navigate(data.user.role === "admin" ? "/admin" : "/");
      } else {
        toast.error(data.message || "Google sign-in failed. Please try again.");
      }
    } catch (err) {
      console.error("Google auth error:", err);
      toast.error("An unexpected error occurred. Please try later.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setIsGoogleLoading(true);
      sendToBackend(tokenResponse.access_token);
    },
    onError: () => {
      setIsGoogleLoading(false);
      toast.error("Google sign-in was cancelled or failed.");
    },
  });

  return { googleLogin, isGoogleLoading };
};
