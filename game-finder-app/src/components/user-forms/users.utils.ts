import { getAuth } from "firebase/auth";

export const getUserToken = async () => {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  return await user.getIdToken();
};
