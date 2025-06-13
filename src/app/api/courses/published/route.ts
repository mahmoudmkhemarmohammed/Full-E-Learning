import { connectDB } from "@/lib/connectDB";
import "@/models/User";
import Course from "@/models/Course";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    await connectDB();

    const publishedCourses = await Course.find({
      status: "published",
    }).populate("instructor", "title email");

    return NextResponse.json({ courses: publishedCourses }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}