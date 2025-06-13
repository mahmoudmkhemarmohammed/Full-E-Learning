import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Course from "@/models/Course";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      title,
      description,
      image,
      coverImage,
      category,
      tags,
      level,
      price,
      whatYouWillLearn,
      prerequisites,
      duration,
      createdBy,
      instructor,
    } = body;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (decoded.role !== "instructor" && decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const courseInstructor = instructor || decoded.userId;

    const newCourse = new Course({
      title,
      description,
      image,
      coverImage,
      category,
      tags,
      level,
      price,
      whatYouWillLearn,
      prerequisites,
      duration,
      createdBy,
      instructor: courseInstructor,
      status: decoded.role === "admin" ? "published" : "draft",
    });

    await newCourse.validate();
    await newCourse.save();

    return NextResponse.json({ course: newCourse }, { status: 201 });
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Server error" },
      { status: 500 }
    );
  }
}
