import mongoose, { Schema, models, model } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "اسم الكورس مطلوب"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "وصف الكورس مطلوب"],
    },
    image: {
      type: String,
      required: [true, "صورة الكورس مطلوبة"],
    },
    coverImage: {
      type: String,
      required: [true, "صورة الغلاف مطلوبة"],
    },
    category: {
      type: String,
      required: [true, "فئة الكورس مطلوبة"],
    },
    tags: {
      type: [String],
      default: [],
      required: [true, "يجب تحديد كلمات مفتاحية"],
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
      required: [true, "مستوى الكورس مطلوب"],
    },
    price: {
      type: Number,
      default: 0,
      required: [true, "سعر الكورس مطلوب"],
    },
    whatYouWillLearn: {
      type: [String],
      default: [],
      required: [true, "مخرجات التعلم مطلوبة"],
    },
    prerequisites: {
      type: [String],
      default: [],
      required: [true, "المتطلبات السابقة مطلوبة"],
    },
    duration: {
      type: Number,
      default: 0,
      required: [true, "مدة الكورس مطلوبة بالساعات أو الدقائق"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "يجب تحديد المحاضر المسؤول عن الكورس"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "منشئ الكورس مطلوب"],
    },
    status: {
      type: String,
      enum: ["draft", "published", "rejected"],
      default: "draft",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Course = models.Course || model("Course", courseSchema);

export default Course;