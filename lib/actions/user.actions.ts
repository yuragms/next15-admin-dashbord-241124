'use server';
import { signIn } from '@/auth';
import db from '@/db/drizzle';
import { users241124 } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function getUser(email: string) {
  const user = await db.query.users241124.findFirst({
    where: eq(users241124.email, email as string),
  });
  if (!user) throw new Error('User not found');
  return user;
}
