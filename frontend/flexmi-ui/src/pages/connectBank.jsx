import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ConnectBank() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const connectBank = async () => {
    setLoading(true);

    // 1️⃣ Trigger backend EMI engine
    await fetch(`https://flex-mi.onrender.com/api/emi/run/${user.uid}`, {
      method: "POST"
    });

    // 2️⃣ Mark bank as connected
    await updateDoc(doc(db, "users", user.uid), {
      bankConnected: true
    });

    // 3️⃣ Redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Connect Your Bank</h2>
        <p style={styles.sub}>
          Securely connect your bank account to analyse your EMI affordability.
        </p>

        <div style={styles.banks}>
          <span>HDFC</span>
          <span>SBI</span>
          <span>ICICI</span>
          <span>Axis</span>
        </div>

        <button style={styles.primaryBtn} onClick={connectBank} disabled={loading}>
          {loading ? "Analysing your cashflow..." : "Connect Bank"}
        </button>

        <p style={styles.secure}>
          🔒 Your data is encrypted and used only for EMI optimisation.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
    padding: 20
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    padding: 30,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center"
  },
  sub: {
    color: "#64748b",
    fontSize: 14,
    margin: "12px 0 20px"
  },
  banks: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: 20,
    color: "#0a2540",
    fontWeight: 600
  },
  primaryBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    background: "#0a2540",
    color: "#fff",
    fontSize: 15
  },
  secure: {
    marginTop: 16,
    fontSize: 12,
    color: "#64748b"
  }
};
