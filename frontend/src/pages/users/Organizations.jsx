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

import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    buildOrganizationRecommendations,
    fallbackOrganizations,
    fallbackVolunteers
} from "../../utils/recommendationEngine";
import { useAuth } from "../../context/AuthContext";

function Organizations() {
    const { isAdmin, isNgo } = useAuth();
    const [organizations, setOrganizations] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        severity: "info",
        message: "Organization recommendations are ready."
    });
    const [form, setForm] = useState({ name: "", location: "", contact: "", needs: "", category: "General" });
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [organizationResponse, volunteerResponse] = await Promise.all([
                API.get("/organizations"),
                API.get("/volunteers")
            ]);

            setOrganizations(organizationResponse.data.length ? organizationResponse.data : fallbackOrganizations);
            setVolunteers(volunteerResponse.data.length ? volunteerResponse.data : fallbackVolunteers);
        } catch {
            setOrganizations(fallbackOrganizations);
            setVolunteers(fallbackVolunteers);
            setStatus({ severity: "warning", message: "Using sample records because the service is unavailable." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const resetForm = () => {
        setForm({ name: "", location: "", contact: "", needs: "", category: "General" });
        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const payload = {
                name: form.name,
                location: form.location,
                contact: form.contact,
                needs: form.needs,
                category: form.category
            };

            if (editingId) {
                await API.put(`/organizations/${editingId}`, payload);
            } else {
                await API.post("/organizations", payload);
            }

            setStatus({ severity: "success", message: editingId ? "Organization updated successfully." : "Organization added successfully." });
            resetForm();
            fetchData();
        } catch (error) {
            setStatus({ severity: "error", message: error.response?.data?.detail || "Unable to save organization." });
        }
    };

    const handleEdit = (organization) => {
        setEditingId(organization.id);
        setForm({
            name: organization.name || "",
            location: organization.location || "",
            contact: organization.contact || "",
            needs: organization.needs || "",
            category: organization.category || "General"
        });
        setStatus({ severity: "info", message: "Editing the selected organization profile." });
    };

    const handleDelete = async (organizationId) => {
        if (!window.confirm("Remove this organization record?")) return;

        try {
            await API.delete(`/organizations/${organizationId}`);
            setStatus({ severity: "success", message: "Organization removed." });
            fetchData();
        } catch {
            setStatus({ severity: "error", message: "Unable to remove organization." });
        }
    };

    const canManage = isAdmin || isNgo;
    const recommendations = buildOrganizationRecommendations(organizations, volunteers);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            Partner Organizations
                        </Typography>
                        <Typography color="text.secondary">
                            A collaborative view of response partners and support networks with role-based management tools.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip icon={<BusinessIcon />} label={`${organizations.length} registered organizations`} color="secondary" variant="filled" />
                        <Chip label={isAdmin ? "Admin view" : isNgo ? "NGO workspace" : "Partner view"} color="info" variant="outlined" />
                    </Stack>
                </Box>

                <Alert severity={status.severity} sx={{ mb: 3, borderRadius: 2 }}>
                    {status.message}
                </Alert>

                {canManage && (
                    <Box sx={{ mb: 4, p: 3, borderRadius: 3, bgcolor: "grey.50" }}>
                        <Typography variant="h6" fontWeight="600" mb={1}>
                            Organization management
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Add new partners, update their support needs, and keep matching recommendations current.
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                <TextField label="Organization name" name="name" value={form.name} onChange={handleChange} required fullWidth />
                                <TextField label="Location" name="location" value={form.location} onChange={handleChange} fullWidth />
                            </Stack>

                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                <TextField label="Contact" name="contact" value={form.contact} onChange={handleChange} fullWidth />
                                <TextField
                                    select
                                    label="Category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    <MenuItem value="General">General</MenuItem>
                                    <MenuItem value="Medical">Medical</MenuItem>
                                    <MenuItem value="Shelter">Shelter</MenuItem>
                                    <MenuItem value="Logistics">Logistics</MenuItem>
                                </TextField>
                            </Stack>

                            <TextField label="Support needs" name="needs" value={form.needs} onChange={handleChange} fullWidth placeholder="Food, Medical, Shelter" />

                            <Stack direction="row" spacing={1}>
                                <Button type="submit" variant="contained" disabled={loading}>
                                    {editingId ? "Save changes" : "Create organization"}
                                </Button>
                                {editingId && (
                                    <Button variant="outlined" onClick={resetForm}>
                                        Cancel
                                    </Button>
                                )}
                            </Stack>
                        </Box>
                    </Box>
                )}

                <Grid container spacing={3}>
                    {recommendations.map(({ organization, recommendation }, index) => (
                        <Grid item xs={12} md={6} lg={4} key={organization.id || index}>
                            <Card elevation={3} sx={{ height: "100%", borderRadius: 3 }}>
                                <CardContent>
                                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" mb={1}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <BusinessIcon color="secondary" />
                                            <Typography variant="h6" fontWeight="600">
                                                {organization.name}
                                            </Typography>
                                        </Stack>

                                        {canManage && (
                                            <Stack direction="row" spacing={0.5}>
                                                <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(organization)}>
                                                    Edit
                                                </Button>
                                                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(organization.id)}>
                                                    Delete
                                                </Button>
                                            </Stack>
                                        )}
                                    </Stack>

                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <LocationOnIcon color="action" fontSize="small" />
                                        <Typography variant="body2" color="text.secondary">
                                            {organization.location}
                                        </Typography>
                                    </Box>

                                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                                        <ContactPhoneIcon color="action" fontSize="small" />
                                        <Typography variant="body2" color="text.secondary">
                                            {organization.contact}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 1.5 }} />

                                    <Typography variant="subtitle2" fontWeight="600" mb={1}>
                                        Suggested Support
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {recommendation?.name || "No recommendation yet"}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Match score: {recommendation?.score ? `${recommendation.score * 100}%` : "0%"} • {recommendation?.reason || "Awaiting volunteer profile"}
                                    </Typography>

                                    <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                                        <Chip label={organization.category || "General"} color="info" size="small" />
                                        <Chip label={organization.needs || "Support needed"} color="info" size="small" />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Container>
    );
}

export default Organizations;