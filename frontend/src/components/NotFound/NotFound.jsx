import { ErrorOutline } from "@mui/icons-material";
import { Typography,Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className="notFound">
      <div className="notFoundContainer">
        <ErrorOutline />
        <Typography variant="h2" style={{ padding: "2vmax" }}>
          Page Not Found
        </Typography>

        <Button to="/" onClick={()=>navigate("/")}>
          <Typography variant="h5">Go to Home</Typography>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;