import admin from "firebase-admin";

const authenticate = async (req, res, next) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    console.log(req.user);
    next();
  } catch (error) {
    console.error("Error verifying ID token:", error);
    res.status(401).send("Unauthorized");
  }
};

export default authenticate;
