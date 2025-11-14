import { Schema, model, Types } from 'mongoose';

interface IWaypoint {
  lat: number;
  lng: number;
  order: number; // 0, 1, 2.. for sorting
}

const waypointSchema = new Schema<IWaypoint>(
  {
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
    order: { type: Number, required: true, min: 0 },
  },
  { _id: false }
); // Don't create _id for sub-documents

// 1. Create an interface representing a document in MongoDB.
interface IRoute {
  userId: Types.ObjectId;
  name: string;
  description: string;
  waypoints: IWaypoint[];
  routeGeometry: {
    type: 'LineString';
    coordinates: number[][]; // [lng, lat] pairs
  };
  distance: number;
  estimatedTime: number;
  isCircuit: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Create a Schema corresponding to the document interface.
const routeSchema = new Schema<IRoute>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    waypoints: {
      type: [waypointSchema],
      required: true,
      validate: {
        validator: function (v: IWaypoint[]) {
          return v.length >= 2 && v.length <= 10;
        },
        message: 'Route must have between 2 and 10 waypoints',
      },
    },
    routeGeometry: {
      type: Object,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
      min: 0,
    },
    estimatedTime: {
      type: Number,
      required: true,
      min: 0,
    },
    isCircuit: {
      type: Boolean,
      required: true,
      default: false,
    },
    isPublic: {
      type: Boolean,
      required: true,
      default: true, // MVP: all routes are public
    },
  },
  {
    timestamps: true, // Auto-creates createdAt and updatedAt
  }
);

// 3. Create a Model

export const Route = model<IRoute>('Route', routeSchema);
