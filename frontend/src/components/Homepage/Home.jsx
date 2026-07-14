import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faTriangleExclamation,
  faChartLine,
  faPeopleGroup,
  faBuildingNgo,
  faBoxesStacked,
  faRobot,
  faMoneyBillTrendUp,
  faLocationDot,
  faUserShield,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";

function Home() {

  const navigate = useNavigate();

  return (
    <>

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">

          Disaster Response
          Management System

        </div>

        <div className="nav-buttons">

          <button
            className="login-btn"
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </button>

          <button
            className="signup-btn"
            onClick={() =>
              navigate("/signup")
            }
          >
            Register
          </button>

        </div>

      </nav>

      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <h1>
            AI Powered Disaster
            Management Platform
          </h1>

          <p>

            Predict resources,
            estimate relief funds,
            detect hotspots,
            manage volunteers,
            coordinate NGOs and
            optimize disaster
            response operations.

          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() =>
                navigate("/login")
              }
            >
              Access System
            </button>

            <button
              className="secondary-btn"
            >
              Learn More
            </button>

          </div>

        </div>

      </section>

      {/* LIVE DASHBOARD */}

      <section className="stats">

        <div className="stat-card">

          <h2>28</h2>

          <p>
            Active Disasters
          </p>

        </div>

        <div className="stat-card">

          <h2>4,521</h2>

          <p>
            Resources Deployed
          </p>

        </div>

        <div className="stat-card">

          <h2>1,230</h2>

          <p>
            Volunteers
          </p>

        </div>

        <div className="stat-card">

          <h2>145</h2>

          <p>
            NGOs Connected
          </p>

        </div>

      </section>

      {/* MODULES */}

      <section className="modules">

        <h2>
          System Modules
        </h2>

        <div className="module-grid">

          <div
            className="module-card"
            onClick={() =>
              navigate("/resources")
            }
          >

            <FontAwesomeIcon
              icon={faBoxesStacked}
              className="module-icon"
            />

            <h3>
              Resource Prediction
            </h3>

            <p>

              AI prediction of
              food kits, shelters,
              medical kits and
              rescue teams.

            </p>

          </div>

          <div
            className="module-card"
            onClick={() =>
              navigate("/funds")
            }
          >

            <FontAwesomeIcon
              icon={faMoneyBillTrendUp}
              className="module-icon"
            />

            <h3>
              Fund Prediction
            </h3>

            <p>

              Estimate disaster
              relief funds using
              machine learning.

            </p>

          </div>

          <div
            className="module-card"
            onClick={() =>
              navigate("/hotspots")
            }
          >

            <FontAwesomeIcon
              icon={faLocationDot}
              className="module-icon"
            />

            <h3>
              Hotspot Detection
            </h3>

            <p>

              Identify high-risk
              regions and disaster
              prone areas.

            </p>

          </div>

          <div
            className="module-card"
            onClick={() =>
              navigate("/anomalies")
            }
          >

            <FontAwesomeIcon
              icon={faRobot}
              className="module-icon"
            />

            <h3>
              Fraud Detection
            </h3>

            <p>

              Detect anomalies and
              suspicious disaster
              transactions.

            </p>

          </div>

          <div
            className="module-card"
            onClick={() =>
              navigate("/volunteers")
            }
          >

            <FontAwesomeIcon
              icon={faPeopleGroup}
              className="module-icon"
            />

            <h3>
              Volunteer Management
            </h3>

            <p>

              Register, allocate
              and manage volunteers.

            </p>

          </div>

          <div
            className="module-card"
            onClick={() =>
              navigate("/organizations")
            }
          >

            <FontAwesomeIcon
              icon={faBuildingNgo}
              className="module-icon"
            />

            <h3>
              NGO Management
            </h3>

            <p>

              Coordinate NGOs and
              monitor relief
              operations.

            </p>

          </div>

        </div>

      </section>

      <section className="features">

    <h2>
        Platform Features
    </h2>

    <div className="feature-list">

        <div className="feature-card">

            <h3>
                Resource Prediction
            </h3>

            <p>

                Predict food kits,
                medical kits,
                shelters, rescue teams
                and water supplies
                required for disaster
                affected regions.

                Helps authorities
                allocate resources
                efficiently and
                avoid shortages.

            </p>

        </div>

        <div className="feature-card">

            <h3>
                Relief Fund Prediction
            </h3>

            <p>

                Estimate disaster
                relief funding based
                on affected population,
                damages, injuries
                and disaster severity.

                Supports faster
                budgeting and
                financial planning.

            </p>

        </div>

        <div className="feature-card">

            <h3>
                Disaster Hotspot Detection
            </h3>

            <p>

                Identify regions with
                high disaster risk using
                historical and real-time
                environmental data.

                Enables proactive
                disaster preparedness
                and mitigation.

            </p>

        </div>

        <div className="feature-card">

            <h3>
                Fraud & Anomaly Detection
            </h3>

            <p>

                Detect suspicious
                transactions, abnormal
                fund usage and unusual
                relief activities.

                Improves transparency
                and prevents misuse
                of disaster resources.

            </p>

        </div>

        <div className="feature-card">

            <h3>
                Volunteer Management
            </h3>

            <p>

                Register volunteers,
                track availability,
                assign tasks and
                monitor field activities.

                Improves coordination
                during emergency
                response operations.

            </p>

        </div>

        <div className="feature-card">

            <h3>
                NGO Management
            </h3>

            <p>

                Maintain NGO profiles,
                resource inventories,
                operational areas and
                contribution records.

                Facilitates collaboration
                among multiple
                organizations.

            </p>

        </div>

        <div className="feature-card">

            <h3>
                Disaster Monitoring
            </h3>

            <p>

                Continuously monitor
                ongoing disasters,
                severity levels,
                affected populations
                and response activities.

                Provides real-time
                situational awareness.

            </p>

        </div>

        <div className="feature-card">

            <h3>
                Analytics Dashboard
            </h3>

            <p>

                Interactive dashboards
                showing disaster trends,
                resource deployment,
                fund utilization and
                response effectiveness.

                Helps decision makers
                take informed actions.

            </p>

        </div>

    </div>

</section>

     

      {/* CTA */}

      <section className="cta">

        <h2>
          Ready To Manage
          Disaster Response?
        </h2>

        <p>

          Join the AI powered
          disaster management
          ecosystem.

        </p>

        <button
          onClick={() =>
            navigate("/signup")
          }
        >
          Get Started
        </button>

      </section>

      {/* FOOTER */}

      <footer className="footer">

        © 2026 Disaster Response
        Management System

      </footer>

    </>
  );
}

export default Home;