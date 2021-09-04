const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{idThread}/comments/{idComment}/replies',
    handler: handler.postReplyHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{idThread}/comments/{idComment}/replies/{idReply}',
    handler: handler.deleteReplyHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },

]);

module.exports = routes;
