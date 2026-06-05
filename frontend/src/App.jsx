import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/dashboard/Dashboard";

import Earthquakes from "./pages/disaster/Earthquakes";
import Hotspots from "./pages/disaster/Hotspots";
import Anomalies from "./pages/disaster/Anomalies";
import ResourcePrediction from "./pages/prediction/ResourcePrediction";
import FundPrediction from "./pages/prediction/FundPrediction";
import Profile from "./pages/users/Profile";

import Volunteers from "./pages/users/Volunteers";

import Organizations from "./pages/users/Organizations";
import BlockchainDashboard from "./pages/blockchain/BlockchainDashboard";
import MainLayout from "./layouts/MainLayout";
function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                           <MainLayout>
                            <Dashboard />
                           </MainLayout>
                            
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/earthquakes"
                    element={
                        <ProtectedRoute>
                          <MainLayout>
                            <Earthquakes />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/hotspots"
                    element={
                        <ProtectedRoute>
                          <MainLayout>
                            <Hotspots />
                          </MainLayout>
                            
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/anomalies"
                    element={
                        <ProtectedRoute>
                          <MainLayout>
                              <Anomalies />
                          </MainLayout>
                           
                        </ProtectedRoute>
                    }
                />
                <Route
 path="/resources"
 element={
  <ProtectedRoute>
    <MainLayout>
   <ResourcePrediction/>
    </MainLayout>
  </ProtectedRoute>
 }
/>

<Route
 path="/funds"
 element={
  <ProtectedRoute>
    <MainLayout>
<FundPrediction/>
    </MainLayout>
  </ProtectedRoute>
 }
/>

<Route
 path="/blockchain"
 element={
  <ProtectedRoute>
    <MainLayout>
<BlockchainDashboard/>
    </MainLayout>
  </ProtectedRoute>
 }
/>
<Route
 path="/profile"
 element={
  <ProtectedRoute>
    <MainLayout>
       <Profile />
    </MainLayout>
  </ProtectedRoute>
 }
/>

<Route
 path="/volunteers"
 element={
  <ProtectedRoute>
    <MainLayout>
        <Volunteers />
    </MainLayout>
  </ProtectedRoute>
 }
/>

<Route
 path="/organizations"
 element={
  <ProtectedRoute>
    <MainLayout>
     <Organizations />
    </MainLayout>
  </ProtectedRoute>
 }
/>
            </Routes>

        </BrowserRouter>
    );
}

export default App;