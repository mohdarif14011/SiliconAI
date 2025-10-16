
'use client';
import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  getRedirectResult,
  signInWithRedirect,
} from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import { Loader2 } from 'lucide-react';

const provider = new GoogleAuthProvider();

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Start as true to handle redirect check
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submissions

  const redirectPath = searchParams.get('redirect') || '/dashboard';

  // Handle redirect result from Google Sign-In on page load
  useEffect(() => {
    const handleRedirect = async () => {
      if (auth.currentUser) {
        setIsLoading(false);
        router.push(redirectPath);
        return;
      }
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          toast({ title: 'Success', description: "You're logged in." });
          await createUserProfileDocument(result.user);
          router.push(redirectPath);
          return; // Stop further execution
        }
      } catch (error) {
        if ((error as FirebaseError).code !== 'auth/redirect-cancelled-by-user') {
          handleAuthError(error as FirebaseError);
        }
      }
      // If there's no redirect result, stop the main loading indicator
      setIsLoading(false);
    };
    handleRedirect();
    // The dependency array is intentionally structured this way.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);


  const handleAuthError = (error: FirebaseError) => {
    setIsSubmitting(false); // Always stop submission loading on error
    console.error('Firebase Auth Error:', error.code, error.message);
    
    // Do not show a toast if the user cancelled the action
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      return;
    }

    let description = 'An unexpected error occurred. Please try again.';
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        description = 'Invalid email or password.';
        break;
      case 'auth/email-already-in-use':
        description = 'This email is already associated with an account.';
        break;
      case 'auth/weak-password':
        description = 'The password is too weak. Please use a stronger password.';
        break;
      case 'auth/invalid-email':
        description = 'Please enter a valid email address.';
        break;
      default:
        // Use a generic message for other errors
        description = "Sorry, we couldn't sign you in. Please try again.";
    }
    toast({
      variant: 'destructive',
      title: 'Authentication Failed',
      description,
    });
  };

  const createUserProfileDocument = async (user: User) => {
    if (!user) return;
    const userRef = doc(firestore, `users/${user.uid}`);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      const { email, displayName, photoURL } = user;
      const registrationDate = serverTimestamp();
      try {
        await setDoc(userRef, {
          id: user.uid,
          email,
          displayName,
          photoURL,
          registrationDate,
        });
      } catch (error) {
        console.error("Error creating user profile", error);
        toast({
          variant: "destructive",
          title: "Profile Creation Failed",
          description: "We couldn't save your user profile. Please contact support."
        })
      }
    }
  };


  const handleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await createUserProfileDocument(userCredential.user);
      toast({ title: 'Success', description: "You're logged in." });
      router.push(redirectPath);
    } catch (error) {
      handleAuthError(error as FirebaseError);
    } 
  };

  const handleSignUp = async () => {
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfileDocument(userCredential.user);
      toast({ title: 'Welcome!', description: 'Your account has been created.' });
      router.push(redirectPath);
    } catch (error) {
      handleAuthError(error as FirebaseError);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserProfileDocument(result.user);
      toast({ title: 'Success', description: "You're logged in." });
      router.push(redirectPath);
    } catch (error) {
       handleAuthError(error as FirebaseError);
    }
  };

  const handlePasswordReset = async (emailForReset: string) => {
    if (!emailForReset) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter your email address.',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, emailForReset);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your inbox for instructions to reset your password.',
      });
    } catch (error) {
      handleAuthError(error as FirebaseError);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)] bg-background p-4">
      <Tabs defaultValue="signin" className="w-[450px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Access your account to continue your interview prep.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-signin">Email</Label>
                <Input
                  id="email-signin"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signin">Password</Label>
                <Input
                  id="password-signin"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <Button onClick={handleSignIn} className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Sign In'}
              </Button>
              <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={isSubmitting}>
                 {isSubmitting ? <Loader2 className="animate-spin" /> : 'Sign In with Google'}
              </Button>
            </CardContent>
            <CardFooter className="text-center text-sm">
                <p>
                    Forgot your password?{' '}
                    <button
                        onClick={() => {
                        const emailForReset = prompt(
                            'Please enter your email to reset your password:'
                        );
                        if (emailForReset) {
                           handlePasswordReset(emailForReset);
                        }
                        }}
                        className="underline"
                        disabled={isSubmitting}
                    >
                        Reset it
                    </button>
                </p>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create an account to start your personalized interview practice.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input
                  id="password-signup"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <Button onClick={handleSignUp} className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Sign Up'}
              </Button>
              <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Sign Up with Google'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
