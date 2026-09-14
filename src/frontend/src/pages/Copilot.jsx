import { useEffect, useRef, useState } from "react";
import { Card, Box, TextField, IconButton, Typography, Stack, Chip, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import AppLayout from "../components/AppLayout.jsx";
import { api } from "../api/client.js";
import { tokens } from "../theme.js";

export default function Copilot() {
  const [messages, setMessages] = useState([
    { role: "bob", text: "I'm Bob, your supply-chain operations copilot. Ask me about an active disruption — try \"what's happening in EU-North?\"" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [watsonxEnabled, setWatsonxEnabled] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    api.getCopilotStatus().then((s) => setWatsonxEnabled(s.watsonxEnabled)).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setSending(true);
    try {
      const { reply, groundedIn } = await api.chatWithBob(text);
      setMessages((m) => [...m, { role: "bob", text: reply, groundedIn }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "bob", text: `Error: ${err.message}` }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <AppLayout title="Bob AI Copilot" subtitle="Ask natural-language questions about live disruptions">
      <Card sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 200px)", minHeight: 420 }}>
        <Box sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${tokens.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box sx={{ width: 30, height: 30, borderRadius: "50%", bgcolor: tokens.indigoSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SmartToyOutlinedIcon sx={{ fontSize: 16, color: tokens.indigo }} />
            </Box>
            <Typography variant="subtitle1">Bob</Typography>
          </Box>
          {watsonxEnabled !== null && (
            <Chip
              size="small"
              label={watsonxEnabled ? "watsonx.ai connected" : "Offline mode (rule-based)"}
              sx={{
                bgcolor: watsonxEnabled ? tokens.emeraldSoft : "#F1F5F9",
                color: watsonxEnabled ? "#065F46" : tokens.textMuted,
              }}
            />
          )}
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2.5, bgcolor: "#FAFBFC" }}>
          <Stack spacing={1.75}>
            {messages.map((m, idx) => (
              <Box key={idx} sx={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <Box
                  sx={{
                    maxWidth: "72%",
                    bgcolor: m.role === "user" ? tokens.indigo : "background.paper",
                    color: m.role === "user" ? "#fff" : "text.primary",
                    border: m.role === "bob" ? `1px solid ${tokens.border}` : "none",
                    borderRadius: 2.5,
                    borderBottomRightRadius: m.role === "user" ? 4 : 20,
                    borderBottomLeftRadius: m.role === "bob" ? 4 : 20,
                    px: 2,
                    py: 1.25,
                    boxShadow: m.role === "bob" ? "0 1px 2px rgba(15,23,42,0.04)" : "none",
                  }}
                >
                  {m.role === "bob" && (
                    <Typography variant="caption" sx={{ display: "block", color: tokens.indigo, fontWeight: 700, mb: 0.375 }}>
                      BOB
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ color: "inherit" }}>{m.text}</Typography>
                  {m.groundedIn && (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={`grounded in ${m.groundedIn}`}
                      sx={{ mt: 0.875, borderColor: tokens.border, fontWeight: 600 }}
                    />
                  )}
                </Box>
              </Box>
            ))}
            {sending && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} thickness={5} />
                <Typography variant="caption" color="text.secondary">Bob is thinking…</Typography>
              </Box>
            )}
            <div ref={bottomRef} />
          </Stack>
        </Box>

        <Box sx={{ p: 1.75, borderTop: `1px solid ${tokens.border}`, display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Ask Bob about a disruption, e.g. DIS-1001…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <IconButton
            onClick={handleSend}
            disabled={sending || !input.trim()}
            sx={{
              bgcolor: tokens.indigo,
              color: "#fff",
              "&:hover": { bgcolor: tokens.indigoDark },
              "&.Mui-disabled": { bgcolor: "#E2E8F0", color: "#94A3B8" },
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Card>
    </AppLayout>
  );
}
