import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    // Reference to User Service (SQL ID - stored as String)
    authorId: {
      type: String,
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    imageUrl: {
      type: String,
      default: ''
    },

    excerpt: {
      type: String,
      maxlength: 500
    },

    content: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true
    },

    publishedAt: {
      type: Date
    },

    // Metrics (denormalized for performance)
    likesCount: {
      type: Number,
      default: 0
    },

    commentsCount: {
      type: Number,
      default: 0
    },

    viewsCount: {
      type: Number,
      default: 0
    },

    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

// Indexes for performance
postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ status: 1, publishedAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
