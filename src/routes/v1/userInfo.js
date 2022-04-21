/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
const express = require('express');
const { loggedIn } = require('../../middleware');
const {
  postUserData,
  uploadFile,
  getUsers,
  getUser,
  deleteUser,
  changePassword,
  postUserPhoto,
  getUserPhotos,
  deleteUserPhoto,
  getAllUsersData,
  postUserLike,
  getAllPhotoLike,
  deleteUserLike,
  getAllPhotoComment,
  postUserComment,
  postUserReplay,
  getUserReplay,
} = require('../../controllers/controller.userInfo');

const router = express.Router();

router.post('/users', loggedIn, postUserData);
router.post('/gallery', loggedIn, postUserPhoto);
router.post('/likes', loggedIn, postUserLike);
router.post('/comment', loggedIn, postUserComment);
router.post('/replay', loggedIn, postUserReplay);
router.get('/gallery', loggedIn, getUserPhotos);
router.get('/users', getUsers);
router.get('/user', getUser);
router.get('/all-users', getAllUsersData);
router.get('/likes', loggedIn, getAllPhotoLike);
router.get('/comment', getAllPhotoComment);
router.get('/replay', getUserReplay);
router.delete('/user/:id', loggedIn, deleteUser);
router.delete('/gallery/:id', loggedIn, deleteUserPhoto);
router.delete('/likes/:id', loggedIn, deleteUserLike);
router.put('/users/:id', loggedIn, changePassword);
router.post('/upload', uploadFile);

module.exports = router;
