import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";

import API from "../../services/api";
import { fallbackOrganizations, fallbackVolunteers } from "../../utils/recommendationEngine";

const initialMessages = [
  {
    id: 1,
    sender: "Operations Lead",
    text: "Medical and logistics support are the top priority for the current response window.",
    time: "09:30"
  },
  {
    id: 2,
    sender: "NGO Team",
    text: "We have two shelter teams ready in the north corridor.",
    time: "09:35"
  }
];

function OperationsCenter() {
  const [volunteers, setVolunteers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState({ severity: "info", message: "Assignments are being generated from current volunteer skills and locations." });

  useEffect(() => {
    const loadMessages = () => {
      try {
        const stored = localStorage.getItem("disaster-chat-messages");
        if (stored) {
          setMessages(JSON.parse(stored));
        }
      } catch {
        setMessages(initialMessages);
      }
    };

    const fetchData = async () => {
      try {
        const [volunteerResponse, organizationResponse] = await Promise.all([
          API.get("/volunteers"),
          API.get("/organizations")
        ]);

        setVolunteers(volunteerResponse.data.length ? volunteerResponse.data : fallbackVolunteers);
        setOrganizations(organizationResponse.data.length ? organizationResponse.data : fallbackOrganizations);
      } catch {
        setVolunteers(fallbackVolunteers);
        setOrganizations(fallbackOrganizations);
        setStatus({ severity: "warning", message: "Using sample data because live records are temporarily unavailable." });
      }
    };

    loadMessages();
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("disaster-chat-messages", JSON.stringify(messages));
  }, [messages]);

  const assignments = useMemo(() => {
    return organizations.map((organization) => {
      const scored = volunteers
        .map((volunteer) => {
          const volunteerSkills = String(volunteer.skills || "").toLowerCase().split(/[,/\s]+/).filter(Boolean);
          const organizationNeeds = String(organization.needs || organization.category || "").toLowerCase().split(/[,/\s]+/).filter(Boolean);
          const overlap = volunteerSkills.filter((skill) => organizationNeeds.includes(skill)).length;
          const locationBonus = volunteer.location === organization.location ? 1 : 0;
          const availabilityBonus = volunteer.availability === "Available" ? 1 : 0;
          const score = overlap * 0.6 + locationBonus * 0.25 + availabilityBonus * 0.15;

          return {
            ...volunteer,
            score: Number(score.toFixed(2)),
            reason: overlap > 0 ? `${overlap} matching skill${overlap > 1 ? "s" : ""}` : "Location and availability fit"
          };
        })
        .sort((a, b) => b.score - a.score)[0];

      return {
        organization,
        volunteer: scored,
        score: scored?.score || 0
      };
    });
  }, [organizations, volunteers]);

  const handleSend = () => {
    if (!draft.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "You",
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, newMessage]);
    setDraft("");
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Operations Center
            </Typography>
            <Typography color="text.secondary">
              Use AI-assisted assignments and an internal coordination chat to accelerate relief deployment.
            </Typography>
          </Box>
          <Chip icon={<AssignmentTurnedInIcon />} label="Smart assignment engine" color="primary" />
        </Box>

        <Alert severity={status.severity} sx={{ mt: 3, borderRadius: 2 }}>
          {status.message}
        </Alert>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, height: "100%" }}>
            <Typography variant="h6" fontWeight="700" mb={2}>
              Recommended assignments
            </Typography>
            <Stack spacing={2}>
              {assignments.map(({ organization, volunteer, score }) => (
                <Card key={organization.id || organization.name} variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1}>
                      <Box>
                        <Typography fontWeight="700">{organization.name}</Typography>
                        <Typography variant="body2" color="text.secondary">Need: {organization.needs || organization.category || "Support"}</Typography>
                      </Box>
                      <Box>
                        <Typography fontWeight="600">{volunteer?.name || "No match"}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Match {Math.round(score * 100)}% • {volunteer?.reason || "Awaiting profile data"}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, height: "100%" }}>
            <Typography variant="h6" fontWeight="700" mb={2}>
              Coordination chat
            </Typography>
            <Box sx={{ bgcolor: "grey.50", borderRadius: 3, p: 2, mb: 2, minHeight: 280, maxHeight: 320, overflow: "auto" }}>
              {messages.map((message) => (
                <Box key={message.id} sx={{ mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">{message.sender} • {message.time}</Typography>
                  <Typography variant="body2">{message.text}</Typography>
                </Box>
              ))}
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Send a message to the team"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button variant="contained" endIcon={<SendIcon />} onClick={handleSend}>
                Send
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default OperationsCenter;
