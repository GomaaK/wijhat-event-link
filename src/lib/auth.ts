import { getClient } from './supabase';

export async function signUpWithEmail(email: string, password: string, name: string) {
  const { data, error } = await getClient().auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await getClient().auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await getClient().auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session } } = await getClient().auth.getSession();
  return session;
}

export async function getUser() {
  const { data: { user } } = await getClient().auth.getUser();
  return user;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await getClient()
    .from('admin_users')
    .select('id')
    .eq('user_id', userId)
    .single();
  if (error) return false;
  return !!data;
}
