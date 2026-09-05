import React, { Component, ErrorInfo, ReactNode } from "react";
import AppLogo from "./brand/AppLogo";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("MicroLink ErrorBoundary caught an unhandled error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    if (typeof window !== "undefined") {
      // Clear potentially corrupted demo state
      localStorage.removeItem("microlink_demo_user");
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.assign("/");
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(ellipse at top, #111827 0%, #030712 100%)",
            color: "#F3F4F6",
            padding: "24px",
            fontFamily: "Inter, system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: 520,
              width: "100%",
              background: "rgba(17, 24, 39, 0.8)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "24px",
              padding: "36px 28px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(239, 68, 68, 0.15)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <AppLogo size={48} showText={true} />
            </div>

            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                marginBottom: "16px",
              }}
            >
              🛡️
            </div>

            <h2
              style={{
                fontSize: "22px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                marginBottom: "8px",
                color: "#FFFFFF",
              }}
            >
              MicroLink Safe Guard Shield
            </h2>

            <p
              style={{
                fontSize: "14px",
                color: "#9CA3AF",
                lineHeight: 1.6,
                marginBottom: "24px",
              }}
            >
              An unexpected render conflict was safely intercepted by the high-traffic error shield. Your account data and wallet balance are secure.
            </p>

            {this.state.error && (
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  color: "#F87171",
                  textAlign: "left",
                  marginBottom: "24px",
                  overflowX: "auto",
                  maxHeight: "120px",
                }}
              >
                {this.state.error.message || "Unknown Application Exception"}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={this.handleReload}
                style={{
                  background: "linear-gradient(135deg, #4F46E5, #06B6D4)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "12px",
                  padding: "10px 20px",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
                  transition: "all 0.2s ease",
                }}
              >
                🔄 Refresh Session
              </button>

              <button
                onClick={this.handleReset}
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  color: "#E5E7EB",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "12px",
                  padding: "10px 18px",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                🧹 Reset Safe State
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
