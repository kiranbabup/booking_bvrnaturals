import React from "react";
import { Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import "./gradientTextStyle.css";

const MotionTypography = motion(Typography);

export const GoldText = React.memo(({ text }) => {
  return (
    <MotionTypography
      variant="h4"
      fontWeight={800}
      textAlign="center"
      mb={6}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      sx={{
        color: "#fff",
        position: "relative",
        display: "inline-block",
        fontSize:{ xs: '20px', md: '28px'},
        "&::after": {
          content: '""',
          position: "absolute",
          left: "50%",
          bottom: -8,
          transform: "translateX(-50%)",
          width: "60%",
          height: "4px",
          background: "linear-gradient(90deg, #d4af37, #ffcc80)",
          borderRadius: 2,
          animation: "underlineGrow 1s ease forwards",
        },
      }}
    >
      {text}
    </MotionTypography>
  );
});
