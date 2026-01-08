import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Simulate() {
  const { user } = useAuth();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing financial state
  useEffect(() => {
    const fetchState = async () => {
      const ref = doc(db, "simulation_state", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setState(snap.data());
      } else {
        setState({
          closing_balance: 12000,
          daily_inflow: 5000,
          total_spent: 3000,
          missed_emi_count: 1
        });
      }
    };

    fetchState();
  }, [user.uid]);

  if (!state) return <p>Loading...</p>;

  // Derived balance (NOT editable)
  const currentBalance =
    state.closing_balance +
    state.daily_inflow -
    state.total_spent;

  const updateState = async () => {
    setLoading(true);

    await fetch(`https://flex-mi.onrender.com/api/simulate/${user.uid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        closing_balance: currentBalance,
        daily_inflow: state.daily_inflow,
        total_spent: state.total_spent,
        missed_emi_count: state.missed_emi_count
      })
    });

    await fetch(`https://flex-mi.onrender.com/api/emi/run/${user.uid}`, {
      method: "POST"
    });

    setLoading(false);
    alert("Financial state updated. Check dashboard.");
  };

  return (
  <div style={styles.page}>
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Financial Control Panel</h2>
        <p style={styles.subtitle}>
          Simulate user cashflow and observe adaptive EMI behavior
        </p>
      </div>

      {/* Balance Highlight */}
      <div style={styles.balanceBox}>
        <span style={styles.balanceLabel}>Current Balance</span>
        <span style={styles.balanceValue}>₹ {currentBalance}</span>
      </div>

      {/* Form */}
      <div style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Previous Balance</label>
          <input style={styles.inputDisabled} value={state.closing_balance} disabled />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Daily Inflow / Salary</label>
          <input
            style={styles.input}
            type="number"
            value={state.daily_inflow}
            onChange={(e) =>
              setState({ ...state, daily_inflow: Number(e.target.value) })
            }
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Total Expenses</label>
          <input
            style={styles.input}
            type="number"
            value={state.total_spent}
            onChange={(e) =>
              setState({ ...state, total_spent: Number(e.target.value) })
            }
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Missed EMI Count</label>
          <input
            style={styles.input}
            type="number"
            value={state.missed_emi_count}
            onChange={(e) =>
              setState({
                ...state,
                missed_emi_count: Number(e.target.value)
              })
            }
          />
        </div>
      </div>

      {/* Action */}
      <button style={styles.button} onClick={updateState} disabled={loading}>
        {loading ? "Recalculating EMI..." : "Update & Recalculate EMI"}
      </button>
    </div>
  </div>
);

}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  },

  card: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 28,
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)"
  },

  header: {
    marginBottom: 24
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 6
  },

  subtitle: {
    fontSize: 14,
    color: "#64748b"
  },

  balanceBox: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  balanceLabel: {
    fontSize: 13,
    color: "#475569",
    fontWeight: 600
  },

  balanceValue: {
    fontSize: 24,
    fontWeight: 700,
    color: "#0f172a"
  },

  form: {
    display: "grid",
    gap: 16,
    marginBottom: 24
  },

  field: {
    display: "flex",
    flexDirection: "column"
  },

  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#475569",
    marginBottom: 6
  },

  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #cbd5f5",
    fontSize: 14,
    outline: "none"
  },

  inputDisabled: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    backgroundColor: "#f1f5f9",
    fontSize: 14,
    color: "#64748b"
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: 10,
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 600,
    border: "none",
    cursor: "pointer"
  }
};

