import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  updateProfile,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  firebaseAuth,
  firestore,
  hasFirebaseConfig,
  firebaseConfigError,
} from "@/integrations/firebase/client";

type Profile = {
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  address: string;
  bio: string;
  interests: string[];
  role: "requester" | "helper" | "both";
  joinedDate: string;
  joinedFull: string;
  location?: {
    city: string;
    lat: number;
    lng: number;
    geohash?: string;
  };
  helperMeta?: {
    skills: string[];
    availability: {
      weekdays: string[];
      startHour: number;
      endHour: number;
      timezone: string;
    };
    experienceYears: number;
    verified: boolean;
    isSuspended: boolean;
  };
  stats?: {
    completedCount: number;
    ratingAvg: number;
    ratingCount: number;
  };
  onboardingComplete?: boolean;
  authProvider?: "password" | "google" | "apple" | "unknown";
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  configError: string | null;
  signUp: (email: string, password: string, profileData?: Partial<Profile>) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null; redirected?: boolean }>;
  signInWithApple: () => Promise<{ error: Error | null; redirected?: boolean }>;
  upsertProfile: (profileData: Partial<Profile>) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

const makeDefaultProfile = (user: User | null): Profile | null => {
  if (!user) return null;
  return {
    name: user.displayName || user.email?.split("@")[0] || "User",
    email: user.email || "",
    phone: "",
    age: "",
    gender: "",
    address: "",
    bio: "",
    interests: [],
    role: "requester",
    joinedDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    joinedFull: new Date().toISOString(),
    onboardingComplete: false,
    authProvider: user.providerData?.[0]?.providerId === "password"
      ? "password"
      : user.providerData?.[0]?.providerId === "google.com"
        ? "google"
        : user.providerData?.[0]?.providerId === "apple.com"
          ? "apple"
          : "unknown",
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseAuth) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(firebaseAuth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      if (!firestore) {
        setProfile(makeDefaultProfile(nextUser));
        setLoading(false);
        return;
      }

      try {
        const profileRef = doc(firestore, "profiles", nextUser.uid);
        const snap = await getDoc(profileRef);
        if (snap.exists()) {
          setProfile(snap.data() as Profile);
        } else {
          const fallback = makeDefaultProfile(nextUser);
          setProfile(fallback);
          if (fallback) {
            await setDoc(profileRef, fallback, { merge: true });
          }
        }
      } catch {
        setProfile(makeDefaultProfile(nextUser));
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const signUp: AuthContextType["signUp"] = async (email, password, profileData) => {
    if (!firebaseAuth) {
      return { error: new Error(firebaseConfigError || "Firebase is not configured") };
    }
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      if (profileData?.name) {
        await updateProfile(cred.user, { displayName: profileData.name });
      }
      const mergedProfile: Profile = {
        ...makeDefaultProfile(cred.user)!,
        ...profileData,
        email: email.toLowerCase(),
        onboardingComplete: true,
        authProvider: "password",
      };
      if (firestore) {
        await setDoc(doc(firestore, "profiles", cred.user.uid), mergedProfile, { merge: true });
      }
      setProfile(mergedProfile);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signIn: AuthContextType["signIn"] = async (email, password) => {
    if (!firebaseAuth) {
      return { error: new Error(firebaseConfigError || "Firebase is not configured") };
    }
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signInWithGoogle: AuthContextType["signInWithGoogle"] = async () => {
    if (!firebaseAuth) {
      return { error: new Error(firebaseConfigError || "Firebase is not configured") };
    }
    try {
      await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
      return { error: null };
    } catch (err) {
      const error = err as { code?: string; message?: string };
      if (
        error.code === "auth/popup-blocked" ||
        error.code === "auth/operation-not-supported-in-this-environment"
      ) {
        await signInWithRedirect(firebaseAuth, new GoogleAuthProvider());
        return { error: null, redirected: true };
      }
      return { error: new Error(error.message || "Google sign-in failed") };
    }
  };

  const signInWithApple: AuthContextType["signInWithApple"] = async () => {
    if (!firebaseAuth) {
      return { error: new Error(firebaseConfigError || "Firebase is not configured") };
    }
    try {
      await signInWithPopup(firebaseAuth, new OAuthProvider("apple.com"));
      return { error: null };
    } catch (err) {
      const error = err as { code?: string; message?: string };
      if (
        error.code === "auth/popup-blocked" ||
        error.code === "auth/operation-not-supported-in-this-environment"
      ) {
        await signInWithRedirect(firebaseAuth, new OAuthProvider("apple.com"));
        return { error: null, redirected: true };
      }
      return { error: new Error(error.message || "Apple sign-in failed") };
    }
  };

  const upsertProfile: AuthContextType["upsertProfile"] = async (profileData) => {
    if (!firebaseAuth?.currentUser) {
      return { error: new Error("No authenticated user") };
    }
    if (!firestore) {
      return { error: new Error("Firestore is not configured") };
    }

    try {
      const uid = firebaseAuth.currentUser.uid;
      const mergedProfile: Profile = {
        ...(makeDefaultProfile(firebaseAuth.currentUser) as Profile),
        ...(profile || {}),
        ...profileData,
        email: (profileData.email || profile?.email || firebaseAuth.currentUser.email || "").toLowerCase(),
        onboardingComplete: true,
      };

      await setDoc(doc(firestore, "profiles", uid), mergedProfile, { merge: true });
      if (mergedProfile.name) {
        await updateProfile(firebaseAuth.currentUser, { displayName: mergedProfile.name });
      }
      setProfile(mergedProfile);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    if (!firebaseAuth) return;
    await firebaseSignOut(firebaseAuth);
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      configError: hasFirebaseConfig ? null : firebaseConfigError,
      signUp,
      signIn,
      signInWithGoogle,
      signInWithApple,
      upsertProfile,
      signOut,
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
