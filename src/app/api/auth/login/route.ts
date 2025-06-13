import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import User from '@/models/User';
import { comparePassword } from '@/lib/hash';
import { signToken } from '@/lib/jwt';
import { serialize } from 'cookie';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const validation = loginSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { email, password } = validation.data;

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const token = signToken({ userId: user._id, role: user.role });

  const serialized = serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 Dayes
    path: '/',
  });

  return new Response(JSON.stringify({ message: 'Login successful' }), {
    status: 200,
    headers: {
      'Set-Cookie': serialized,
    },
  });
}