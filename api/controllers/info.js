const db = require('../db');

// 获取特定ID的个人信息
exports.getUserById = (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.sendServerError('Invalid req params');
  }
  try {
    db.get('SELECT * FROM users WHERE did = ?', id, (err, row) => {
      if (err) {
        return res.sendServerError(err.message);
      }
      if (row) {
        return res.sendSuccess(row, 'Search user successfully');
      }
      return res.sendNotFound('User not found');
    });
  } catch (error) {
    return res.sendServerError(error);
  }
  return false;
};

// 创建用户接口，先检查 did 是否已存在
exports.createUser = (req, res) => {
  const { username, phone, email, birthday, did } = req.body;
  if (!did) {
    return res.sendServerError('Invalid req params');
  }
  try {
    // 先查询数据库是否存在相同的 did
    db.get('SELECT * FROM users WHERE did = ?', did, (err, row) => {
      if (err) {
        return res.sendServerError(err.message);
      }
      if (row) {
        return res.sendCreated(row, 'User created successfully');
      }

      try {
        // 如果不存在，可以创建新用户
        db.run(
          'INSERT INTO users (username, phone, email, birthday, did) VALUES (?, ?, ?, ?, ?)',
          [username, phone, email, birthday, did],
          (e) => {
            if (e) {
              return res.sendServerError(e.message);
            }
            return res.sendCreated(
              {
                id: this.lastID,
                username,
                phone,
                email,
                birthday,
                did,
              },
              'User created successfully'
            );
          }
        );
      } catch (error) {
        return res.sendServerError(error);
      }
      return false;
    });
  } catch (error) {
    return res.sendServerError(error);
  }
  return false;
};

// 更新特定ID的个人信息
exports.updateUser = (req, res) => {
  const { username, phone, email, birthday, did } = req.body;
  if (!did) {
    return res.sendServerError('Invalid req params');
  }
  try {
    db.run(
      'UPDATE users SET username = ?, phone = ?, email = ?, birthday = ? WHERE did = ?',
      [username, phone, email, birthday, did],
      (err) => {
        if (err) {
          return res.sendClientError(err.message);
        }
        return res.sendSuccess(
          {
            username,
            phone,
            email,
            birthday,
            did,
          },
          'User update successfully'
        );
      }
    );
  } catch (error) {
    return res.sendServerError(error);
  }
  return false;
};
