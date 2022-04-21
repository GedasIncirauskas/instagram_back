const bcrypt = require('bcryptjs');
const {
  getUsersFromDB,
  getUserFromDB,
  getUserPhotoFromDB,
  deleteUserFromDB,
  postUserDataToDB,
  changeUserPassword,
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
} = require('../database');

module.exports = {
  postUserData,
  uploadFile,
  getUsers,
  getUser,
  deleteUser,
  changePassword,
  postUserPhoto,
  postUserLike,
  getUserPhotos,
  deleteUserPhoto,
  getAllUsersData,
  deleteUserLike,
  getAllPhotoLike,
  getAllPhotoComment,
  postUserComment,
  postUserReplay,
  getUserReplay,
};

async function getUsers(req, res) {
  try {
    const users = await getUsersFromDB();
    return res.send(users);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
}

async function getAllPhotoComment(req, res) {
  try {
    const users = await getCommentsFromDB();
    return res.send(users);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
}

async function getUserReplay(req, res) {
  try {
    const users = await getReplayFromDB();
    return res.send(users);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
}

async function getAllPhotoLike(req, res) {
  try {
    const users = await getPhotoLikesFromDB();
    return res.send(users);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
}

async function getUser(req, res) {
  try {
    const user = await getUserFromDB();
    return res.send(user);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
}

async function getAllUsersData(req, res) {
  try {
    const users = await getAllUsersDataFromDB();

    return res.send(users);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
}

async function getUserPhotos(req, res) {
  try {
    const user = await getUserPhotoFromDB(req.userData);
    return res.send(user);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
}

async function deleteUser(req, res) {
  const id = req.params;
  try {
    const userDelete = await deleteUserFromDB(id);
    return res.send(userDelete);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
}

async function deleteUserPhoto(req, res) {
  const id = req;
  try {
    const userPhotoDelete = await deleteUserPhotoFromDB(id);
    return res.send(userPhotoDelete);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
}

async function deleteUserLike(req, res) {
  const data = req;
  try {
    const userPhotoDelete = await deleteUserLikeFromDB(data);
    return res.send(userPhotoDelete);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
}

async function postUserData(req, res) {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).send({ err: 'Incorrect data passed' });
  }

  try {
    const userPost = await postUserDataToDB(req);
    return res.send(userPost);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
}

async function postUserComment(req, res) {
  const { fotoCommentId } = req.body;
  if (!fotoCommentId) {
    return res.status(400).send({ err: 'Incorrect data passed' });
  }

  try {
    const userPost = await postUserCommentToDB(req);
    return res.send(userPost);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
}

async function postUserReplay(req, res) {
  const { answerId } = req.body;
  if (!answerId) {
    return res.status(400).send({ err: 'Incorrect data passed' });
  }

  try {
    const userPost = await postUserReplayToDB(req);
    return res.send(userPost);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
}

async function postUserPhoto(req, res) {
  const { userID, fileName } = req.body;
  if (!userID || !fileName) {
    return res.status(400).send({ err: 'Incorrect data passed' });
  }
  try {
    const userPost = await postUserPhotosToDB(req);
    return res.send(userPost);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
}

async function postUserLike(req, res) {
  // const { imageID, userID } = req.body;
  // if (!imageID || !userID) {
  //   return res.status(400).send({ err: 'Incorrect data passed' });
  // }
  try {
    const userPost = await postUserLikeToDB(req);
    return res.send(userPost);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
}

async function changePassword(req, res) {
  const currentUser = req.userData;
  const userEnterPassword = req.body.password;
  bcrypt.compare(userEnterPassword, currentUser.password, async (error, valid) => {
    if (error) {
      return res.status(400).send({ err: 'Password do not mach!' });
    }
    if (valid) {
      try {
        const encryptedPassword = bcrypt.hashSync(req.body.newPassword);
        const data = {
          password: encryptedPassword,
          id: currentUser.id,
        };
        const passwordChange = await changeUserPassword(data);
        return res.send(passwordChange);
      } catch (err) {
        return res.status(500).send({ err: 'Internal Server Error' });
      }
    }
  });
}

function uploadFile(req, res) {
  const newpath = `${__dirname}/../../files/`;
  const { myFile } = req.files;
  const number = Math.floor(Math.random() * 10000000 + 1);
  const filename = `${myFile.name}${number.toString()}`;
  myFile.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      res.status(500).send({ message: 'File upload failed' });
      return;
    }
    res.status(200).send({ message: 'File Uploaded', code: 200, path: `/static/${filename}` });
  });
}
