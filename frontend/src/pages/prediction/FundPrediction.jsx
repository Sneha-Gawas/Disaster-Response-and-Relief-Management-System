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
  Box,
  Chip,
  Divider,
  Alert,
  Stack
} from "@mui/material";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function FundPrediction() {
  const [form, setForm] = useState({
    magnitude: "",
    affected_population: "",
    property_damage: "",
    crop_damage: "",
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
        "http://localhost:8000/fund_prediction",
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

  const totalFund =
    Number(result?.required_relief_fund || 0);

  const allocations = {
    shelters: Math.round(totalFund * 0.35),
    medical: Math.round(totalFund * 0.25),
    food: Math.round(totalFund * 0.20),
    rescue: Math.round(totalFund * 0.20)
  };

  const fundStatus =
    totalFund > 10000000
      ? "National Emergency"
      : totalFund > 5000000
      ? "High Priority"
      : totalFund > 1000000
      ? "Moderate Priority"
      : "Local Response";

  const getRecommendation = () => {
    if (!severity) return [];

    switch (severity.level) {
      case "Critical":
        return [
          "Release emergency funds immediately.",
          "Request state and national assistance.",
          "Prioritize medical and shelter allocation.",
          "Activate disaster contingency reserves."
        ];

      case "High":
        return [
          "Increase relief fund allocation.",
          "Deploy temporary shelters.",
          "Allocate additional medical resources.",
          "Mobilize emergency response teams."
        ];

      case "Medium":
        return [
          "Monitor fund utilization.",
          "Maintain reserve funding.",
          "Prepare contingency resources."
        ];

      default:
        return [
          "Maintain baseline funding reserves.",
          "Continue monitoring the disaster situation."
        ];
    }
  };

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
          align="center"
          fontWeight="bold"
          gutterBottom
        >
          Relief Fund Prediction
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          mb={4}
        >
          AI-powered disaster relief fund estimation
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
                  affected_population:
                    e.target.value
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
                  property_damage:
                    e.target.value
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Crop Damage"
              fullWidth
              value={form.crop_damage}
              onChange={(e) =>
                setForm({
                  ...form,
                  crop_damage:
                    e.target.value
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
                  injuries:
                    e.target.value
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Deaths"
              fullWidth
              value={form.deaths}
              onChange={(e) =>
                setForm({
                  ...form,
                  deaths:
                    e.target.value
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
          >
            {loading
              ? "Predicting..."
              : "Predict Fund"}
          </Button>
        </Box>

        {result && (
          <Box mt={5}>
            <Box
              display="flex"
              justifyContent="center"
              gap={2}
              mb={3}
            >
              <Chip
                label={`Severity: ${severity.level}`}
                color={severity.color}
              />

              <Chip
                label={fundStatus}
                color="primary"
              />
            </Box>

            <Card
              elevation={5}
              sx={{
                borderRadius: 4,
                mb: 4
              }}
            >
              <CardContent
                sx={{
                  textAlign: "center"
                }}
              >
                <AccountBalanceWalletIcon
                  sx={{
                    fontSize: 60
                  }}
                />

                <Typography
                  variant="h6"
                >
                  Predicted Relief Fund
                </Typography>

                <Typography
                  variant="h3"
                  fontWeight="bold"
                >
                  ₹
                  {totalFund.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>

            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
            >
              Fund Allocation
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={4}>
                  <CardContent
                    sx={{
                      textAlign:
                        "center"
                    }}
                  >
                    <HomeWorkIcon
                      sx={{
                        fontSize: 40
                      }}
                    />

                    <Typography>
                      Shelters
                    </Typography>

                    <Typography
                      variant="h6"
                    >
                      ₹
                      {allocations.shelters.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={4}>
                  <CardContent
                    sx={{
                      textAlign:
                        "center"
                    }}
                  >
                    <MedicalServicesIcon
                      sx={{
                        fontSize: 40
                      }}
                    />

                    <Typography>
                      Medical
                    </Typography>

                    <Typography
                      variant="h6"
                    >
                      ₹
                      {allocations.medical.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={4}>
                  <CardContent
                    sx={{
                      textAlign:
                        "center"
                    }}
                  >
                    <RestaurantIcon
                      sx={{
                        fontSize: 40
                      }}
                    />

                    <Typography>
                      Food
                    </Typography>

                    <Typography
                      variant="h6"
                    >
                      ₹
                      {allocations.food.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={4}>
                  <CardContent
                    sx={{
                      textAlign:
                        "center"
                    }}
                  >
                    <GroupsIcon
                      sx={{
                        fontSize: 40
                      }}
                    />

                    <Typography>
                      Rescue
                    </Typography>

                    <Typography
                      variant="h6"
                    >
                      ₹
                      {allocations.rescue.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
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
                gutterBottom
                fontWeight="bold"
              >
                Funding Recommendations
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                mb={2}
              >
                Recommended relief actions and fund deployment priorities for the current disaster scenario.
              </Typography>

              <Stack spacing={1.5}>
                {getRecommendation().map(
                  (
                    recommendation,
                    index
                  ) => (
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
                  gutterBottom
                >
                  Model Performance
                </Typography>

                <Divider
                  sx={{
                    mb: 2
                  }}
                />

                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xs={12}
                    md={3}
                  >
                    <Typography color="text.secondary">
                      Model
                    </Typography>

                    <Typography fontWeight="bold">
                      {modelInfo.model}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={3}
                  >
                    <Typography color="text.secondary">
                      R² Score
                    </Typography>

                    <Typography fontWeight="bold">
                      {modelInfo.r2_score}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={3}
                  >
                    <Typography color="text.secondary">
                      MAE
                    </Typography>

                    <Typography fontWeight="bold">
                      {modelInfo.mae}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={3}
                  >
                    <Typography color="text.secondary">
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

export default FundPrediction;