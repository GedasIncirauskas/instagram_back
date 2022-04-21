const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const dbQaries = {
  getUsersQuery: () => 'SELECT id, email FROM users WHERE status = 0 ORDER BY id ASC',
  getUserQuery: () => `SELECT users.id, users.email, 
    userdata.phone, userdata.gender, userdata.color, userdata.photo, userdata.hobbies, userdata.about 
    FROM users LEFT JOIN userdata ON users.id = userdata.user_id ORDER BY id ASC`,
  getCurrentUserQuery: (data) => `SELECT id, email, password FROM users WHERE email = ${mysql.escape(data.email)}`,
  postUserQuery: (data) => {
    const encryptedPassword = bcrypt.hashSync(data.password);
    return `INSERT INTO users (email, password) VALUES (${mysql.escape(data.email)}, '${encryptedPassword}')`;
  },
  getUserQueryById: (data) => `UPDATE users SET status = 1 WHERE id = ${mysql.escape(data.id)}`,
  postExtraDataQuery: (data) => {
    const { user_id, phone, gender, color, photo, hobbies, about } = data.body;
    return `INSERT INTO userdata (user_id, phone, gender, color, photo, hobbies, about)
        VALUES (
            ${mysql.escape(user_id)}, ${mysql.escape(phone)}, ${mysql.escape(gender)}, 
            ${mysql.escape(color)}, ${mysql.escape(photo)}, ${mysql.escape(hobbies)}, 
            ${mysql.escape(about)}
        )`;
  },
  updateUserQuery: (data) => `UPDATE users SET password = ${mysql.escape(data.password)} WHERE id = ${mysql.escape(data.id)}`,
  getUpdatedUserQuery: (data) => `SELECT * FROM users WHERE id = ${mysql.escape(data.id)}`,
  getUserPhotoQuery: (data) => `SELECT * FROM userPhotos WHERE userIDe = ${mysql.escape(data.id)} ORDER BY photoID DESC`,
  postUserPhotosQuery: (data) =>
    `INSERT INTO userPhotos (userIDe, fileName) VALUES (${mysql.escape(data.userID)}, ${mysql.escape(data.fileName)})`,
  deletePhotoQueryById: (data) => `DELETE FROM userPhotos WHERE photoID = ${mysql.escape(data.id)}`,
  getAllUsersDataQuery: () => `
  SELECT users.id, users.email, userdata.photo, userPhotos.photoID, userPhotos.fileName, userPhotos.upload_time, likes.imageID, likes.userID, likes.userEmail as userLiked
  FROM users
  LEFT JOIN userdata ON users.id = userdata.user_id
  LEFT JOIN userPhotos ON users.id = userPhotos.userIDe
  LEFT JOIN likes ON userPhotos.photoID = likes.imageID
  ORDER BY upload_time DESC
  `,
  postUserLikeQuery: (data) =>
    `INSERT INTO likes (imageID, userID, userEmail, imagePath) 
   VALUES (${mysql.escape(data.imageID)}, ${mysql.escape(data.userID)}, ${mysql.escape(data.userEmail)},${mysql.escape(data.imagePath)})`,
  deleteLikeQueryById: (data) =>
    `DELETE FROM likes WHERE imageID = ${mysql.escape(data.params.id)} && userID = ${mysql.escape(data.userData.id)}`,
  getLikesQuery: () =>
    'SELECT GROUP_CONCAT(userEmail SEPARATOR " ") as totalLikedUsers, imageID,COUNT(*) as TOTAL FROM likes GROUP BY imageID',
  getCommentsQuery: () =>
    'SELECT users.email, comments.fotoCommentId, comments.comment, comments.commentId FROM comments LEFT JOIN users ON users.id = comments.commentOwner ORDER BY commentId DESC',
  postUserCommentQuery: (data) =>
    `INSERT INTO comments (fotoCommentId, comment, commentOwner) 
    VALUES (${mysql.escape(data.body.fotoCommentId)}, ${mysql.escape(data.body.comment)}, ${mysql.escape(data.userData.id)})`,

  postUserReplayQuery: (data) =>
    `INSERT INTO answer (answerId, answer, answerOwner) 
    VALUES (${mysql.escape(data.body.answerId)}, ${mysql.escape(data.body.answer)}, ${mysql.escape(data.userData.email)})`,
  getReplayQuery: () => 'SELECT * FROM answer ORDER BY replayId ASC',
};

module.exports = dbQaries;
