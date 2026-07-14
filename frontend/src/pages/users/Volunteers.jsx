import { useEffect, useState } from "react";

import API from "../../services/api";

import {
    Container,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Box,
    Stack,
    Divider,
    Alert,
    Button,
    TextField,
    MenuItem
} from "@mui/material";

import GroupsIcon from "@mui/icons-material/Groups";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    buildVolunteerRecommendations,
    fallbackOrganizations,
    fallbackVolunteers
} from "../../utils/recommendationEngine";
import { useAuth } from "../../context/AuthContext";

function Volunteers() {
    const { user, isAdmin, isNgo, isVolunteer } = useAuth();
    const [volunteers, setVolunteers] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        severity: "info",
        message: "Volunteer matching suggestions are ready."
    });
    const [notifications, setNotifications] = useState([]);
    const [requests, setRequests] = useState([]);
    const [volunteerFlowState, setVolunteerFlowState] = useState({});
    const [form, setForm] = useState({
        name: "",
        email: "",
        location: "",
        skills: "",
        availability: "Available"
    });
    const [editingId, setEditingId] = useState(null);

    const loadStoredRequests = () => {
        try {
            const stored = localStorage.getItem("ngoVolunteerRequests");
            if (stored) {
                return JSON.parse(stored);
            }
        } catch {
            // ignore storage issues and use defaults
        }

        return [
            {
                id: 1,
                name: "Mina Rao",
                email: "mina@example.com",
                skills: "First Aid, Counseling",
                location: "Pune",
                status: "Pending",
                requestedAt: "Just now"
            },
            {
                id: 2,
                name: "Arjun Das",
                email: "arjun@example.com",
                skills: "Logistics, Shelter Support",
                location: "Nashik",
                status: "Pending",
                requestedAt: "10 mins ago"
            }
        ];
    };

    const loadStoredNotifications = () => {
        try {
            const stored = localStorage.getItem("ngoVolunteerNotifications");
            if (stored) {
                return JSON.parse(stored);
            }
        } catch {
            // ignore storage issues and use defaults
        }

        return [];
    };

    const fetchData = async () => {
        setLoading(true);
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
            setStatus({
                severity: "warning",
                message: "Using sample data because the service is currently unavailable."
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        try {
            const storedState = localStorage.getItem("volunteerAcceptanceState");
            if (storedState) {
                setVolunteerFlowState(JSON.parse(storedState));
            }
        } catch {
            setVolunteerFlowState({});
        }

        setRequests(loadStoredRequests());
        setNotifications(loadStoredNotifications());
        fetchData();
    }, []);

    useEffect(() => {
        localStorage.setItem("ngoVolunteerRequests", JSON.stringify(requests));
    }, [requests]);

    useEffect(() => {
        localStorage.setItem("ngoVolunteerNotifications", JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
        localStorage.setItem("volunteerAcceptanceState", JSON.stringify(volunteerFlowState));
    }, [volunteerFlowState]);

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const resetForm = () => {
        setForm({ name: "", email: "", location: "", skills: "", availability: "Available" });
        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isVolunteer) {
            setStatus({
                severity: "info",
                message: "Only volunteers can submit their own skill updates for review."
            });
            return;
        }

        try {
            const payload = {
                name: form.name,
                email: form.email,
                skills: form.skills,
                location: form.location,
                availability: form.availability
            };

            await API.put(`/volunteers/${user?.user_id}`, payload);

            setVolunteerFlowState((prev) => ({
                ...prev,
                [String(user?.user_id)]: "Pending Acceptance",
                [user?.email]: "Pending Acceptance"
            }));

            setStatus({
                severity: "info",
                message: "Your skill update has been submitted for NGO review. Assignment recommendations will unlock after acceptance."
            });
            resetForm();
            fetchData();
        } catch (error) {
            setStatus({
                severity: "error",
                message: error.response?.data?.detail || "Unable to save volunteer profile."
            });
        }
    };

    const handleEdit = (volunteer) => {
        setEditingId(volunteer.id);
        setForm({
            name: volunteer.name || "",
            email: volunteer.email || "",
            location: volunteer.location || "",
            skills: volunteer.skills || "",
            availability: volunteer.availability || "Available"
        });
        setStatus({ severity: "info", message: "Editing the selected volunteer profile." });
    };

    const handleDelete = async (volunteerId) => {
        if (!window.confirm("Remove this volunteer record?")) return;

        try {
            await API.delete(`/volunteers/${volunteerId}`);
            setStatus({ severity: "success", message: "Volunteer removed." });
            fetchData();
        } catch {
            setStatus({ severity: "error", message: "Unable to remove volunteer." });
        }
    };

    const handleRequestDecision = (requestId, decision) => {
        const targetRequest = requests.find((item) => item.id === requestId);
        const updatedRequests = requests.map((item) =>
            item.id === requestId
                ? {
                      ...item,
                      status: decision === "accept" ? "Accepted" : "Rejected",
                      reviewedAt: new Date().toLocaleString()
                  }
                : item
        );

        if (targetRequest?.email) {
            setVolunteerFlowState((prev) => ({
                ...prev,
                [targetRequest.email]: decision === "accept" ? "Accepted" : "Rejected",
                [targetRequest.name]: decision === "accept" ? "Accepted" : "Rejected"
            }));
        }

        setRequests(updatedRequests);
        setNotifications((prev) => [
            {
                id: Date.now(),
                type: decision === "accept" ? "success" : "warning",
                message: `Volunteer request for ${targetRequest?.name || "a volunteer"} was ${decision === "accept" ? "accepted" : "rejected"}.`
            },
            ...prev
        ].slice(0, 5));
        setStatus({
            severity: decision === "accept" ? "success" : "warning",
            message: `Volunteer request ${decision === "accept" ? "accepted" : "rejected"}.`
        });
    };

    const canManage = isAdmin || isNgo;
    const canVolunteerUpdate = isVolunteer;
    const getVolunteerStatus = (volunteer) => {
        const statusFromState = volunteerFlowState[String(volunteer?.id)] || volunteerFlowState[volunteer?.email] || volunteerFlowState[volunteer?.name];
        return statusFromState || (isVolunteer && String(volunteer?.id) === String(user?.user_id) ? "Pending Acceptance" : "Accepted");
    };
    const visibleVolunteers = (isVolunteer
        ? volunteers.filter((volunteer) => String(volunteer.id) === String(user?.user_id))
        : volunteers
    ).filter(Boolean);

    const recommendations = buildVolunteerRecommendations(visibleVolunteers, organizations);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            Volunteer Network
                        </Typography>
                        <Typography color="text.secondary">
                            {isVolunteer
                                ? "Track your volunteering profile and discover the best matching response opportunities."
                                : "Connect skilled responders and community helpers instantly with tailored matches."}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip
                            icon={<VolunteerActivismIcon />}
                            label={`${visibleVolunteers.length} active volunteers`}
                            color="primary"
                            variant="filled"
                        />
                        <Chip
                            label={isAdmin ? "Admin view" : isNgo ? "NGO workspace" : "Volunteer workspace"}
                            color="secondary"
                            variant="outlined"
                        />
                    </Stack>
                </Box>

                <Alert severity={status.severity} sx={{ mb: 3, borderRadius: 2 }}>
                    {status.message}
                </Alert>

                {(canManage || isVolunteer) && (
                    <Box sx={{ mb: 4, p: 3, borderRadius: 3, bgcolor: "grey.50" }}>
                        <Typography variant="h6" fontWeight="600" mb={1}>
                            {isNgo ? "Volunteer approval inbox" : canVolunteerUpdate ? "Volunteer management" : "Your volunteer profile"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            {isNgo
                                ? "Review volunteer requests, approve or reject them, and keep your team informed with instant updates."
                                : canVolunteerUpdate
                                ? "Update your skills and availability. Your profile stays pending until an NGO accepts it, and assignment recommendations become active after approval."
                                : "Review volunteer records and assignment readiness."}
                        </Typography>

                        {isNgo && (
                            <Box sx={{ display: "grid", gap: 2, mb: 3 }}>
                                <Typography variant="subtitle2" fontWeight="600">
                                    Pending volunteer requests
                                </Typography>
                                {requests.filter((item) => item.status === "Pending").length ? (
                                    requests
                                        .filter((item) => item.status === "Pending")
                                        .map((item) => (
                                            <Card key={item.id} variant="outlined" sx={{ borderRadius: 2 }}>
                                                <CardContent>
                                                    <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" } }}>
                                                        <Box>
                                                            <Typography fontWeight="600">{item.name}</Typography>
                                                            <Typography variant="body2" color="text.secondary">{item.email}</Typography>
                                                            <Typography variant="caption" color="text.secondary">Skills: {item.skills || "General support"} • {item.location}</Typography>
                                                        </Box>
                                                        <Stack direction="row" spacing={1}>
                                                            <Button size="small" variant="contained" color="success" onClick={() => handleRequestDecision(item.id, "accept")}>
                                                                Accept
                                                            </Button>
                                                            <Button size="small" variant="outlined" color="warning" onClick={() => handleRequestDecision(item.id, "reject")}>
                                                                Reject
                                                            </Button>
                                                        </Stack>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        ))
                                ) : (
                                    <Alert severity="info">No volunteer requests are waiting for review.</Alert>
                                )}

                                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "white" }}>
                                    <Typography variant="subtitle2" fontWeight="600" mb={1}>
                                        Recent notifications
                                    </Typography>
                                    {notifications.length ? (
                                        notifications.map((notification) => (
                                            <Alert key={notification.id} severity={notification.type} sx={{ mb: 1 }}>
                                                {notification.message}
                                            </Alert>
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">Notifications will appear here after each action.</Typography>
                                    )}
                                </Box>
                            </Box>
                        )}

                        {canVolunteerUpdate && (
                            <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
                                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                    <TextField label="Full name" name="name" value={form.name} onChange={handleChange} required fullWidth />
                                    <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth />
                                </Stack>

                                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                    <TextField label="Location" name="location" value={form.location} onChange={handleChange} fullWidth />
                                    <TextField label="Skills" name="skills" value={form.skills} onChange={handleChange} fullWidth placeholder="Medical Support, Logistics" />
                                </Stack>

                                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                    <TextField
                                        select
                                        label="Availability"
                                        name="availability"
                                        value={form.availability}
                                        onChange={handleChange}
                                        fullWidth
                                    >
                                        <MenuItem value="Available">Available</MenuItem>
                                        <MenuItem value="Busy">Busy</MenuItem>
                                        <MenuItem value="On Call">On Call</MenuItem>
                                    </TextField>
                                </Stack>

                                <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                                    <Button type="submit" variant="contained" disabled={loading}>
                                        Submit for approval
                                    </Button>
                                    <Typography variant="caption" color="text.secondary">
                                        Status: {getVolunteerStatus({ id: user?.user_id, email: user?.email, name: user?.full_name })}
                                    </Typography>
                                </Stack>
                            </Box>
                        )}
                    </Box>
                )}

                <Grid container spacing={3}>
                    {visibleVolunteers.length ? (
                        visibleVolunteers.map((volunteer, index) => (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={volunteer.id || index}>
                                <Card elevation={3} sx={{ height: "100%", borderRadius: 3 }}>
                                    <CardContent>
                                        <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                                <GroupsIcon color="primary" />
                                                <Typography variant="h6" fontWeight="600">
                                                    {volunteer.name}
                                                </Typography>
                                            </Stack>

                                            {isVolunteer && String(volunteer.id) === String(user?.user_id) && (
                                                <Chip
                                                    size="small"
                                                    color={getVolunteerStatus(volunteer) === "Accepted" ? "success" : getVolunteerStatus(volunteer) === "Rejected" ? "error" : "warning"}
                                                    label={getVolunteerStatus(volunteer)}
                                                />
                                            )}
                                        </Stack>

                                        <Typography variant="body2" color="text.secondary" mb={1}>
                                            {volunteer.email}
                                        </Typography>

                                        <Divider sx={{ my: 1.5 }} />

                                        <Typography variant="subtitle2" fontWeight="600" mb={1}>
                                            Skills
                                        </Typography>
                                        <Box display="flex" flexWrap="wrap" gap={1}>
                                            {(volunteer.skills || "General Support")
                                                .split(",")
                                                .map((skill, idx) => (
                                                    <Chip key={idx} label={skill.trim()} size="small" color="success" variant="outlined" />
                                                ))}
                                        </Box>

                                        <Box mt={2}>
                                            <Typography variant="subtitle2" fontWeight="600">
                                                Best Match
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {getVolunteerStatus(volunteer) === "Accepted"
                                                    ? recommendations[index]?.recommendation?.name || "No match yet"
                                                    : "Pending NGO acceptance"}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {getVolunteerStatus(volunteer) === "Accepted"
                                                    ? `Match score: ${recommendations[index]?.recommendation?.score ? `${recommendations[index].recommendation.score * 100}%` : "0%"} • ${recommendations[index]?.recommendation?.reason || "Awaiting profile data"}`
                                                    : "Assignments will be unlocked after acceptance."}
                                            </Typography>
                                        </Box>

                                        <Box mt={2} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <CheckCircleIcon color="success" fontSize="small" />
                                            <Typography variant="body2" color="text.secondary">
                                                {volunteer.availability || "Available"} for rapid response support
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid size={{ xs: 12 }}>
                            <Alert severity="info">No volunteer records are available for this role yet.</Alert>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Container>
    );
}

export default Volunteers;