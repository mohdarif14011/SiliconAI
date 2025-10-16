
'use client';
import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithRedirect,
  GoogleAuthProvider,
  User,
  getRedirectResult,
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
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import { Loader2 } from 'lucide-react';

const provider = new GoogleAuthProvider();

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(true);


  useEffect(() => {
    const processRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          await createUserProfileDocument(result.user);
          toast({ title: 'Success', description: "You're logged in." });
          router.push('/dashboard');
        } else {
            setIsProcessingRedirect(false);
        }
      } catch (error) {
        handleAuthError(error as FirebaseError);
        setIsProcessingRedirect(false);
      }
    };
    processRedirect();
  }, [auth, router, toast]);

  const handleAuthError = (error: FirebaseError) => {
    console.error('Firebase Auth Error:', error.code, error.message);
    let description = 'An unexpected error occurred. Please try again.';
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
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
      case 'auth/popup-blocked':
      case 'auth/cancelled-popup-request':
        description = 'The sign-in popup was blocked or cancelled. Please try again.';
        break;
      default:
        description = error.message;
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
      const createdAt = serverTimestamp();
      try {
        await setDoc(userRef, {
          id: user.uid,
          email,
          displayName,
          photoURL,
          registrationDate: createdAt,
        });
      } catch (error) {
        console.error("Error creating user profile", error);
      }
    }
  };


  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success', description: "You're logged in." });
      router.push('/dashboard');
    } catch (error) {
      handleAuthError(error as FirebaseError);
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfileDocument(userCredential.user);
      toast({ title: 'Welcome!', description: 'Your account has been created.' });
      router.push('/dashboard');
    } catch (error) {
      handleAuthError(error as FirebaseError);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      handleAuthError(error as FirebaseError);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter your email address.',
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your inbox for instructions to reset your password.',
      });
    } catch (error) {
      handleAuthError(error as FirebaseError);
    }
  };

  if (isProcessingRedirect) {
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signin">Password</Label>
                <Input
                  id="password-signin"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleSignIn} className="w-full">
                Sign In
              </Button>
              <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">
                Sign In with Google
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
                            setResetEmail(emailForReset);
                            handlePasswordReset();
                        }
                        }}
                        className="underline"
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input
                  id="password-signup"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleSignUp} className="w-full">
                Sign Up
              </Button>
              <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">
                Sign Up with Google
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
