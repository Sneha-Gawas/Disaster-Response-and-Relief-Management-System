import { useState } from "react";
import axios from "axios";

import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  Divider,
  Box,
  Chip,
  Stack
} from "@mui/material";

import RestaurantIcon from "@mui/icons-material/Restaurant";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function ResourcePrediction() {
  const [form, setForm] = useState({
    magnitude: "",
    affected_population: "",
    property_damage: "",
    injuries: "",
    deaths: ""
  });

  const [result, setResult] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const predict = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:8000/resource_prediction",
        {
          params: form
        }
      );

      setResult(response.data);
      setModelInfo(response.data.model_info);
    } catch (error) {
      console.error(error);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const getSeverity = () => {
    if (!result) return null;

    const score =
      Number(form.magnitude || 0) +
      Number(form.injuries || 0) * 0.1 +
      Number(form.deaths || 0) * 0.5;

    if (score > 50)
      return {
        level: "Critical",
        color: "error"
      };

    if (score > 25)
      return {
        level: "High",
        color: "warning"
      };

    if (score > 10)
      return {
        level: "Medium",
        color: "info"
      };

    return {
      level: "Low",
      color: "success"
    };
  };

  const severity = getSeverity();
  const alertSeverity =
    severity?.level === "Critical"
      ? "error"
      : severity?.level === "High"
      ? "warning"
      : "info";

  const getRecommendation = () => {
    if (!severity) return [];

    switch (severity.level) {
      case "Critical":
        return [
          "Immediate evacuation required.",
          "Deploy all available rescue teams.",
          "Establish emergency medical camps.",
          "Request state and national assistance.",
          "Activate disaster command center."
        ];

      case "High":
        return [
          "Deploy additional rescue teams.",
          "Increase food and water supplies.",
          "Set up temporary shelters.",
          "Alert hospitals and emergency services."
        ];

      case "Medium":
        return [
          "Monitor affected areas closely.",
          "Prepare backup resources.",
          "Keep emergency teams on standby."
        ];

      default:
        return [
          "Continue monitoring the situation.",
          "Maintain standard emergency readiness."
        ];
    }
  };

  const resourceCards = [
    {
      title: "Food Kits",
      value: result?.food_kits,
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />
    },
    {
      title: "Medical Kits",
      value: result?.medical_kits,
      icon: <MedicalServicesIcon sx={{ fontSize: 40 }} />
    },
    {
      title: "Shelters",
      value: result?.shelters_required,
      icon: <HomeIcon sx={{ fontSize: 40 }} />
    },
    {
      title: "Rescue Teams",
      value: result?.rescue_teams,
      icon: <GroupsIcon sx={{ fontSize: 40 }} />
    },
    {
      title: "Water Units",
      value: result?.water_units,
      icon: <WaterDropIcon sx={{ fontSize: 40 }} />
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          align="center"
          gutterBottom
        >
          Disaster Resource Prediction
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          mb={4}
        >
          Predict emergency resources required during disasters using AI.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Magnitude"
              fullWidth
              value={form.magnitude}
              onChange={(e) =>
                setForm({
                  ...form,
                  magnitude: e.target.value
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Affected Population"
              fullWidth
              value={form.affected_population}
              onChange={(e) =>
                setForm({
                  ...form,
                  affected_population: e.target.value
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Property Damage"
              fullWidth
              value={form.property_damage}
              onChange={(e) =>
                setForm({
                  ...form,
                  property_damage: e.target.value
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Injuries"
              fullWidth
              value={form.injuries}
              onChange={(e) =>
                setForm({
                  ...form,
                  injuries: e.target.value
                })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Deaths"
              fullWidth
              value={form.deaths}
              onChange={(e) =>
                setForm({
                  ...form,
                  deaths: e.target.value
                })
              }
            />
          </Grid>
        </Grid>

        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            size="large"
            onClick={predict}
            disabled={loading}
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: 3
            }}
          >
            {loading ? "Predicting..." : "Predict Resources"}
          </Button>
        </Box>

        {result && (
          <Box mt={5}>
            <Box
              display="flex"
              justifyContent="center"
              mb={3}
            >
              <Chip
                label={`Severity: ${severity.level}`}
                color={severity.color}
                size="medium"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  px: 1
                }}
              />
            </Box>

            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
            >
              Predicted Resources
            </Typography>

            <Grid container spacing={3}>
              {resourceCards.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={index}
                >
                  <Card
                    elevation={5}
                    sx={{
                      borderRadius: 4,
                      height: 170,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)"
                      }
                    }}
                  >
                    <CardContent
                      sx={{
                        textAlign: "center"
                      }}
                    >
                      {item.icon}

                      <Typography
                        variant="h6"
                        mt={1}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        variant="h4"
                        fontWeight="bold"
                      >
                        {item.value}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Paper
              elevation={4}
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 4,
                background:
                  "linear-gradient(135deg, rgba(25,118,210,0.06), rgba(25,118,210,0.12))"
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
              >
                Recommended Action Plan
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                mb={2}
              >
                Suggested response steps based on the current severity level and predicted demand.
              </Typography>

              <Stack spacing={1.5}>
                {getRecommendation().map(
                  (recommendation, index) => (
                    <Alert
                      key={index}
                      severity={alertSeverity}
                      icon={<CheckCircleIcon />}
                      sx={{ borderRadius: 2 }}
                    >
                      <Typography fontWeight={600}>
                        Priority {index + 1}
                      </Typography>
                      <Typography>{recommendation}</Typography>
                    </Alert>
                  )
                )}
              </Stack>
            </Paper>

            {modelInfo && (
              <Paper
                elevation={4}
                sx={{
                  mt: 4,
                  p: 3,
                  borderRadius: 4
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  Model Performance
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Model
                    </Typography>

                    <Typography fontWeight="bold">
                      {modelInfo.model}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      R² Score
                    </Typography>

                    <Typography fontWeight="bold">
                      {modelInfo.r2_score}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      MAE
                    </Typography>

                    <Typography fontWeight="bold">
                      {modelInfo.mae}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      RMSE
                    </Typography>

                    <Typography fontWeight="bold">
                      {modelInfo.rmse}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default ResourcePrediction;