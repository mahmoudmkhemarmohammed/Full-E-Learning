import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Course from "@/models/Course";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import User from "@/models/User";

export async function PATCH(_: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      params.id,
      { status: "published" },
      { new: true }
    );

    return NextResponse.json({ course: updatedCourse }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}