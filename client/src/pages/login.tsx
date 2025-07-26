import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to role selection page
    setLocation("/choose-role");
  }, [setLocation]);

  return null;
}
