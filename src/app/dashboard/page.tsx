import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardClient from './components/Dashboard'; 

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <DashboardClient userName={session.user?.name || 'User'} userImage={session.user?.image || ''}/>;
}
