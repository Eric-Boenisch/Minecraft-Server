'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function LogoutAction() {
  const cookieStore = await cookies();
  
  // 1. Delete the auth cookie
  cookieStore.delete('auth_token');

  // 2. Redirect the user back to the login page
  redirect('/login');
}