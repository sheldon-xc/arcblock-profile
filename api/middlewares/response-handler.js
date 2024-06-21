// responseHandler.js

const responseHandler = (req, res, next) => {
  // 发送成功响应
  res.sendSuccess = (data, message = 'Success') => {
    res.status(200).json({
      code: 200,
      status: 'success',
      data,
      message,
    });
  };

  // 发送创建成功响应
  res.sendCreated = (data, message = 'Created') => {
    res.status(201).json({
      code: 201,
      status: 'success',
      data,
      message,
    });
  };

  // 发送客户端错误响应
  res.sendClientError = (message = 'Bad Request') => {
    res.status(400).json({
      code: 400,
      status: 'error',
      message,
    });
  };

  // 发送未授权错误响应
  res.sendUnauthorized = (message = 'Unauthorized') => {
    res.status(401).json({
      code: 401,
      status: 'error',
      message,
    });
  };

  // 发送禁止访问错误响应
  res.sendForbidden = (message = 'Forbidden') => {
    res.status(403).json({
      code: 403,
      status: 'error',
      message,
    });
  };

  // 发送未找到资源错误响应
  res.sendNotFound = (message = 'Not Found') => {
    res.status(404).json({
      code: 404,
      status: 'error',
      message,
    });
  };

  // 发送服务器错误响应
  res.sendServerError = (message = 'Internal Server Error') => {
    res.status(500).json({
      code: 500,
      status: 'error',
      message,
    });
  };

  next();
};

module.exports = responseHandler;
