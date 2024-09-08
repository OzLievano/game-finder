import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

type AccountData = {
  password: string;
  confirmPassword?: string;
  displayName?: string;
  email: string;
};

export const createAccount = async ({password, confirmPassword, displayName, email} : AccountData) => {
  try {
    if (password !== confirmPassword) {
      throw new Error("Password and confirm password do not match");
      return;
    }
    const userCredentials = await createUserWithEmailAndPassword(
      getAuth(),
      email,
      password
    );
    await updateProfile(userCredentials.user, {
      displayName: displayName,
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logIn = async ({email, password} : AccountData) => {
  try {
    await signInWithEmailAndPassword(getAuth(), email, password);
  } catch (error: any) {
    throw new Error(error.message);
  }
};