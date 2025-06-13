import mongoose, { Schema, models, model } from "mongoose";

const lectureSchema = new Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Lecture = models.Lecture || model("Lecture", lectureSchema);
export default Lecture;
