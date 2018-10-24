module.exports.errorResponse = (error) => {
  let errorRes = null;

  console.log('---ERR0R---\n', JSON.stringify(error));

  if (!error.code) {
    errorRes = {
      code: 'unexpected_error',
      message: 'Please contact customer service.',
    };
  } else {
    errorRes = error;
  }

  const res = {
    status: 400,
    body: {
      error: errorRes,
    },
  };

  return `[400] ${JSON.stringify(res)}`;
};
