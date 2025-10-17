
import { Suspense } from 'react';
import LoginClientPage from './login-client-page';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginClientPage />
    </Suspense>
  );
}
