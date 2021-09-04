const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{id}/comments',
    handler: handler.postCommentHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{id}/comments/{idComment}',
    handler: handler.deleteCommentHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);

module.exports = routes;
