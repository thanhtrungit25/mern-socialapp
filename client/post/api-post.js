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

export { listByUser, listNewsFeed, create };
