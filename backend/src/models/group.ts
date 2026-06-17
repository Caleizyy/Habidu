import { Schema, model, Document, Types } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
}

const GroupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Group = model<IGroup>('Group', GroupSchema);
