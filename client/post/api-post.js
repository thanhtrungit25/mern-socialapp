const listNewsFeed = async (params, credentials) => {
  try {
    let response = await fetch('/api/posts/feed/' + params.userId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const listByUser = async (params, credentials) => {
  try {
    let response = await fetch('/api/posts/by/' + params.userId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const create = async (params, credentials, post) => {
  try {
    let response = await fetch('/api/posts/new/' + params.userId, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + credentials.t,
      },
      body: post,
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const comment = async (params, credentials, postId, comment) => {
  try {
    let response = await fetch('/api/posts/comment', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
      body: JSON.stringify({
        userId: params.userId,
        postId: postId,
        comment: comment,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const uncomment = async (params, credentials, postId, comment) => {
  try {
    let response = await fetch('/api/posts/uncomment', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
      body: JSON.stringify({
        userId: params.userId,
        postId: postId,
        comment: comment,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const remove = async (params, credentials) => {
  try {
    let response = await fetch('/api/posts/' + params.postId, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const like = async (params, credentials, postId) => {
  try {
    let response = await fetch('/api/posts/like', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, postId: postId }),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const unlike = async (params, credentials, postId) => {
  try {
    let response = await fetch('/api/posts/unlike', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, postId: postId }),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export {
  listByUser,
  listNewsFeed,
  create,
  remove,
  comment,
  uncomment,
  like,
  unlike,
};
