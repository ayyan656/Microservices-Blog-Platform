// create model in sql without sequelize
import { pool } from '../config/db.js';
class CommentModel {
  static async create({ postId, userId, content, parentCommentId = null, authorName = null }) {
    const [result] = await pool.execute(
      `INSERT INTO comments (post_id, user_id, content, parent_comment_id, author_name)
       VALUES (?, ?, ?, ?, ?)`,
      [postId, userId, content, parentCommentId, authorName]
    );

    return result.insertId;
  }

  static async findByPost(postId) {
    const [rows] = await pool.execute(
      `SELECT *
       FROM comments
       WHERE post_id = ? AND status = 'active'
       ORDER BY created_at ASC`,
      [postId]
    );
    return rows;
  }

  static async findById(commentId) {
    const [rows] = await pool.execute(
      `SELECT * FROM comments WHERE id = ?`,
      [commentId]
    );
    return rows[0];
  }

  static async delete(commentId) {
    const [result] = await pool.execute(
      `UPDATE comments
       SET status = 'deleted'
       WHERE id = ?`,
      [commentId]
    );
    return result.affectedRows > 0;
  }

  static async update(commentId, content) {
    const [result] = await pool.execute(
      `UPDATE comments
       SET content = ?
       WHERE id = ? AND status = 'active'`,
      [content, commentId]
    );
    return result.affectedRows > 0;
  }
}

export default CommentModel;

