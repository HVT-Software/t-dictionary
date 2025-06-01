import axios from 'axios';
import type { Session } from 'next-auth';
import { cookies } from 'next/headers';
import { getSession } from './getSession';

const API_URL = process.env.API_URL;

export const serverInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

serverInstance.interceptors.request.use(async value => {
  const session = (await getSession()) as Session;
  value.headers.set('Authorization', `Bearer ${session?.token}`);
  return value;
});

serverInstance.interceptors.response.use(undefined, async error => {
  if (error.response?.status === 401) {
    (await cookies()).delete('next-auth.session-token');
  }

  return Promise.reject(error);
});
