import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Course from "@/models/Course";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import User from "@/models/User";
import "@/models/User";
import "@/models/Lecture";


export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: courseId } = await context.params;

    const course = await Course.findById(courseId)
      .populate("instructor", "title email")
      .populate("lectures");

    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const courseId = (await context.params)?.id;
    if (!courseId)
      return NextResponse.json({ error: "Missing course ID" }, { status: 400 });

    const course = await Course.findById(courseId);
    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });

    // if User is instructor
    if (user.role === "instructor") {
      if (course.instructor.toString() !== user._id.toString()) {
        return NextResponse.json({ error: "Not your course" }, { status: 403 });
      }

      if (course.status !== "draft") {
        return NextResponse.json(
          { error: "Instructors can only delete draft courses" },
          { status: 403 }
        );
      }
    }

    await course.deleteOne();

    return NextResponse.json(
      { message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Server error" },
      { status: 500 }
    );
  }
}



export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized: Token is missing" }, { status: 401 });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { id: courseId } = await context.params;
    const course = await Course.findById(courseId);

    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });

    if (user.role === "instructor") {
      if (course.instructor.toString() !== user._id.toString()) {
        return NextResponse.json(
          { error: "Access Denied: You are not the owner of this course" },
          { status: 403 }
        );
      }

      if (course.status !== "draft") {
        return NextResponse.json(
          { error: "Instructors can only edit draft courses" },
          { status: 400 }
        );
      }
    }

    const body = await request.json();

    const allowedFields = [
      "title",
      "description",
      "price",
      "image",
      "level",
      "category",
      "coverImage",
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    for (const key in body) {
      if (user.role === "admin") {
        updateData[key] = body[key];
      } else if (user.role === "instructor") {
        if (key === "status") {
          return NextResponse.json(
            { error: "Instructors are not allowed to modify course status" },
            { status: 403 }
          );
        }
        if (allowedFields.includes(key)) {
          updateData[key] = body[key];
        } else {
          return NextResponse.json(
            { error: `Field '${key}' is not editable by instructors` },
            { status: 403 }
          );
        }
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return NextResponse.json(
      { message: "Course updated successfully", course: updatedCourse },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
