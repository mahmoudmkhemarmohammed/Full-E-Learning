import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import User from '@/models/User';
import { hashPassword } from '@/lib/hash';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const validation = registerSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { name, email, password } = validation.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
  }

  const hashed = await hashPassword(password);

  const user = await User.create({ name, email, password: hashed });

  return NextResponse.json({ message: 'User created', user }, { status: 201 });
}