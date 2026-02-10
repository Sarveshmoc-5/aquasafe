import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login({ onLogin }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"iot" | "manual">("manual");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("mode", role);
      onLogin();
    } catch (error) {
      alert("Login failed. Check email and password.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 30 }}>
      <h2>Login</h2>
      <p>Smart Water Quality & Health Prediction</p>

      <input
        placeholder="Email Address"
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <p>Select User Role</p>

      <button onClick={() => setRole("manual")}>
        Standard User (View Only)
      </button>

      <button onClick={() => setRole("iot")}>
        Smart User (With IoT Kit)
      </button>

      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
