import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema(
    {
        artist: { type: String, required: true, trim: true},
        stage: { type: String, required: true, trime: true},
        style: { type: String, required: true, trim: true},
        startAt: { type: Date, required: true},
        endAt: { type: Date, required:true},
    },
    { _id: false }
);

SlotSchema.pre("validate", function (next){
    if (this.startAt && this.endAt && this.endAt <= this.startAt) {
        return next (new Error("Slot endAt must be after startAt"));
    }
    next();
});

const LocationSchema = new mongoose.Schema(
    {
        place: { type: String, trime: true},
        city: { type: String, trim: true},
        country: { type: String, trim: true },
        coords: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
                required: true
            },
            coordinates: {
                type: [Number],
                required: true,
                validate: {
                validator: (arr) =>
                    Array.isArray(arr) &&
                    arr.length === 2 &&
                    arr.every((n) => typeof n === "number") &&
                    arr[0] >= -180 &&
                    arr[0] <= 180 &&
                    arr[1] >= -90 &&
                    arr[1] <= 90,
                message:
                    "coords.coordinates must be [lng, lat] with valid numeric ranges",
                },
            },
        },
    },
    { _id: false}
);

const FestivalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  location: {
    type: LocationSchema,
    required: true,
  },

  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },

  genres: {
    type: [String],
    default: [],
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.every((g) => !!g && g.trim().length > 0),
      message: "All genres must be non-empty strings",
    },
  },

  popularity: {
    type: Number,
    min: 0,
    default: 0,
  },

  slots: {
    type: [SlotSchema],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

FestivalSchema.pre("validate", function (next) {
  if (this.startAt && this.endAt && this.endAt < this.startAt) {
    return next(new Error("endAt must be after or equal to startAt"));
  }
  next();
});

FestivalSchema.index({ "location.coords": "2dsphere" });
FestivalSchema.index({ name: "text" });                 
FestivalSchema.index({ startAt: 1 });                     
FestivalSchema.index({ popularity: -1 });                

export const Festival = mongoose.model("Festival", FestivalSchema);