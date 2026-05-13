const express = require("express");
const router = express.Router();

const JWT_VALIDATION_URL = "https://internal/v1/jwt/token";

router.post("/", async (req, res) => {
  const { transactionId, date, customerNumber, jwttoken } = req.body;

  if (!transactionId || !date || !customerNumber || !jwttoken) {
    return res.status(400).json({
      status: "failure",
      error:
        "Missing required fields: transactionId, date, customerNumber, jwttoken",
    });
  }

  try {
    const response = await fetch(JWT_VALIDATION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwttoken}`,
      },
      body: JSON.stringify({ transactionId, date, customerNumber }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return res
          .status(200)
          .json({ status: "failure", error: "JWT validation failed" });
      }
      return res
        .status(502)
        .json({ status: "failure", error: "JWT service unavailable" });
    }

    const data = await response.json();

    return res.status(200).json({
      status: data.valid ? "success" : "failure",
      transactionId,
    });
  } catch (err) {
    if (err.name === "TimeoutError" || err.name === "AbortError") {
      return res
        .status(502)
        .json({ status: "failure", error: "JWT service timeout" });
    }
    return res
      .status(502)
      .json({ status: "failure", error: "JWT service unavailable" });
  }
});

module.exports = router;
