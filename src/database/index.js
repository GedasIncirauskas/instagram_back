const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const dbQaries = require('./dbQuaries');

const { dbConfig } = require('../config');

module.exports = {
  enterUserDataToDB,
  getCrediantialsFromDB,
  getUsersFromDB,
  getUserFromDB,
  deleteUserFromDB,
  postUserDataToDB,
  changeUserPassword,
  getUserPhotoFromDB,
  postUserPhotosToDB,
  postUserLikeToDB,
  deleteUserPhotoFromDB,
  getAllUsersDataFromDB,
  deleteUserLikeFromDB,
  getPhotoLikesFromDB,
  getCommentsFromDB,
  postUserCommentToDB,
  postUserReplayToDB,
  getReplayFromDB,
};

async function makeDBrequest(query) {
  const conn = await mysql.createConnection(dbConfig);
  const [data] = await conn.execute(query);
  await conn.end();
  return data;
}

async function enterUserDataToDB(userInput) {
  const query = dbQaries.postUserQuery(userInput);
  const data = await makeDBrequest(query);
  return data;
}

async function getReplayFromDB() {
  const query = dbQaries.getReplayQuery();
  const data = await makeDBrequest(query);
  return data;
}

async function getCommentsFromDB(userInput) {
  const query = dbQaries.getCommentsQuery(userInput);
  const data = await makeDBrequest(query);
  return data;
}

async function getCrediantialsFromDB(userInput) {
  const query = dbQaries.getCurrentUserQuery(userInput);
  const data = await makeDBrequest(query);
  return data;
}

// Get all users
async function getUsersFromDB() {
  const query = dbQaries.getUsersQuery();
  const data = await makeDBrequest(query);
  return data;
}

// Get likes
async function getPhotoLikesFromDB() {
  const query = dbQaries.getLikesQuery();
  const data = await makeDBrequest(query);
  return data;
}

// Get all users with data
async function getAllUsersDataFromDB() {
  const query = dbQaries.getAllUsersDataQuery();
  const data = await makeDBrequest(query);
  return data;
}

// Get all user photos
async function getUserPhotoFromDB(id) {
  const query = dbQaries.getUserPhotoQuery(id);
  const data = await makeDBrequest(query);
  return data;
}

// Get current user with extra data
async function getUserFromDB() {
  const query = dbQaries.getUserQuery();
  const data = await makeDBrequest(query);
  return data;
}

// Delete current user
async function deleteUserFromDB(data) {
  const query = dbQaries.getUserQueryById(data);
  const response = await makeDBrequest(query);
  return response;
}

// Delete current user photo
async function deleteUserPhotoFromDB(data) {
  const query = dbQaries.deletePhotoQueryById(data.params);
  const response = await makeDBrequest(query);
  return response;
}

// Delete LIKE
async function deleteUserLikeFromDB(data) {
  const query = dbQaries.deleteLikeQueryById(data);
  const response = await makeDBrequest(query);
  return response;
}

// Post current user extra data
async function postUserDataToDB(req) {
  const query = dbQaries.postExtraDataQuery(req);
  const data = await makeDBrequest(query);
  return data;
}

// Post comment
async function postUserCommentToDB(req) {
  const query = dbQaries.postUserCommentQuery(req);
  const data = await makeDBrequest(query);
  return data;
}

async function postUserReplayToDB(req) {
  const query = dbQaries.postUserReplayQuery(req);
  const data = await makeDBrequest(query);
  return data;
}

// Post current user photos
async function postUserPhotosToDB(req) {
  const query = dbQaries.postUserPhotosQuery(req.body);
  const data = await makeDBrequest(query);
  return data;
}

// Post LIKE
async function postUserLikeToDB(req) {
  const query = dbQaries.postUserLikeQuery(req.body);
  const data = await makeDBrequest(query);
  return data;
}

// Change password for current user
async function changeUserPassword(data) {
  const query = dbQaries.updateUserQuery(data);
  await makeDBrequest(query);
  const secondQuery = dbQaries.getUpdatedUserQuery(data);
  const user = await makeDBrequest(secondQuery);
  const token = jwt.sign(
    {
      id: user[0].id,
      email: user[0].email,
      password: user[0].password,
    },
    process.env.JWT_SECRET,
  );
  return { msg: 'Changed password', token, id: user[0].id };
}
