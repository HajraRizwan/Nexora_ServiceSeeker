import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import axios from "axios";

const API_URL = "http://172.21.251.76:5001/api";


interface Provider {
  _id: string;
  name: string;
  email: string;
  contactNumber: string;
  cnicNumber: string;
  status: string;
  skills: Array<{ category: string; subcategories: string[] }>;
}

export default function AdminVerification() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [documents, setDocuments] = useState<any>(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  useEffect(() => {
  loadPendingProviders();
}, []);

const loadPendingProviders = async () => {
  setLoading(true);
  try {
    // Make the request to the backend
    const res = await axios.get(`${API_URL}/admin/pending`);
    
    if (res.data.success) {
      setProviders(res.data.data);
    }
  } catch (err) {
    alert("Failed to load pending providers");
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  const viewDocuments = async (provider: Provider) => {
    setSelectedProvider(provider);
    setLoadingDocuments(true);

    try {
      const res = await axios.get(
        `${API_URL}/admin/provider/${provider._id}/documents`
      );
      if (res.data.success) {
        setDocuments(res.data.data);
        setShowDocuments(true);
      }
    } catch (err) {
      alert("Failed to load documents");
    } finally {
      setLoadingDocuments(false);
    }
  };

  const approveProvider = async () => {
    if (!selectedProvider) return;

    if (!window.confirm(`Approve ${selectedProvider.name}?`)) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/admin/approve/${selectedProvider._id}`
      );
      if (res.data.success) {
        alert("Provider approved");
        setShowDocuments(false);
        loadPendingProviders();
      }
    } finally {
      setLoading(false);
    }
  };

  const rejectProvider = async () => {
    if (!selectedProvider) return;

    if (!window.confirm(`Reject ${selectedProvider.name}?`)) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/admin/reject/${selectedProvider._id}`,
        { reason: "Rejected by admin" }
      );
      if (res.data.success) {
        alert("Provider rejected");
        setShowDocuments(false);
        loadPendingProviders();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Verification</h1>
      <p style={styles.subtitle}>
        Pending Registrations: {providers.length}
      </p>

      {/* Provider List */}
      <div style={styles.scrollArea}>
        {loading ? (
          <p>Loading providers...</p>
        ) : providers.length === 0 ? (
          <p>No pending registrations</p>
        ) : (
          providers.map((p) => (
            <div key={p._id} style={styles.card}>
              <h2 style={styles.providerName}>{p.name}</h2>
              <p>{p.email}</p>
              <p>{p.contactNumber}</p>

              <div style={styles.skillsBox}>
                <strong>Skills:</strong>
                {p.skills.map((s) => (
                  <p key={s.category}>
                    <strong>{s.category}:</strong> {s.subcategories.join(", ")}
                  </p>
                ))}
              </div>

              <button
                style={styles.viewBtn}
                onClick={() => viewDocuments(p)}
              >
                <Eye size={18} /> View Documents
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showDocuments && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>{selectedProvider?.name} - Documents</h3>
              <button
                style={styles.closeBtn}
                onClick={() => setShowDocuments(false)}
              >
                ✕
              </button>
            </div>

            {loadingDocuments ? (
              <p>Loading...</p>
            ) : (
              <div style={styles.modalScroll}>
                {documents?.profilePhoto && (
                  <div style={styles.docSection}>
                    <p>Profile Photo</p>
                    <img src={documents.profilePhoto} style={styles.image} />
                  </div>
                )}

                {documents?.cnicFront && (
                  <div style={styles.docSection}>
                    <p>CNIC Front</p>
                    <img src={documents.cnicFront} style={styles.image} />
                  </div>
                )}

                {documents?.cnicBack && (
                  <div style={styles.docSection}>
                    <p>CNIC Back</p>
                    <img src={documents.cnicBack} style={styles.image} />
                  </div>
                )}

                {documents?.criminalClearance && (
                  <div style={styles.docSection}>
                    <p>Criminal Clearance</p>
                    <img
                      src={documents.criminalClearance}
                      style={styles.image}
                    />
                  </div>
                )}
              </div>
            )}

            <div style={styles.actionRow}>
              <button
                style={styles.approveBtn}
                onClick={approveProvider}
              >
                <CheckCircle size={18} /> Approve
              </button>

              <button
                style={styles.rejectBtn}
                onClick={rejectProvider}
              >
                <XCircle size={18} /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ✅ INLINE CSS (Browser-compatible) */
const styles: any = {
  container: { padding: 30 },
  title: { fontSize: 28, fontWeight: "700", color: "#19034d" },
  subtitle: { color: "#666" },
  scrollArea: {
    marginTop: 20,
    maxHeight: "70vh",
    overflowY: "auto",
  },
  card: {
    border: "1px solid #ddd",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    background: "#fafafa",
  },
  skillsBox: { marginTop: 10 },
  providerName: { fontWeight: "700", fontSize: 18 },
  viewBtn: {
    marginTop: 10,
    padding: "8px 12px",
    background: "#e8e8ff",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },

  /* MODAL */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: 450,
    maxHeight: "90vh",
    overflow: "hidden",
    background: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 22,
  },
  modalScroll: {
    maxHeight: "60vh",
    overflowY: "auto",
  },
  docSection: { marginBottom: 20 },
  image: {
    width: "100%",
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  actionRow: {
    marginTop: 10,
    display: "flex",
    justifyContent: "space-between",
  },
  approveBtn: {
    background: "#05c053",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  rejectBtn: {
    background: "#ff3333",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
};
