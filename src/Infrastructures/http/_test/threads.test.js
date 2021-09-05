const pool = require('../../database/postgres/pool');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const injections = require('../../injections');
const createServer = require('../createServer');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 200 and new thread', async () => {
      const requestPayload = {
        title: 'dicoding',
        body: 'Dicoding Indonesia',
      };
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(injections);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        title: 'dicoding',

      };
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(injections);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirim title dan body');
    });
    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        title: 'dicoding',
        body: 1,
      };
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(injections);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread karena tipe data tidak sesuai');
    });
  });
  describe('when GET /threads', () => {
    it('should response 404 if thread is not found', async () => {
      const server = await createServer(injections);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',

      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread not found');
    });

    it('should response 200 and get thread by id', async () => {
      const server = await createServer(injections);
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'anwar', password: 'secret', fullname: 'anwar',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-8821', owner: 'user-123', title: 'dicoding', body: 'dicoding',
      });
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-8821',

      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });
  });

  describe('when POST /threads/{id}/comments', () => {
    it('should response 404 ', async () => {
      const server = await createServer(injections);
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'anwar', password: 'secret', fullname: 'anwar',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-8821', owner: 'user-123', title: 'dicoding', body: 'dicoding',
      });
      const payload = {
        content: 'dicoding',
      };
      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload,

      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread not found');
    });
    it('should response 200 and create new thread', async () => {
      const server = await createServer(injections);
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'anwar', password: 'secret', fullname: 'anwar',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', owner: 'user-123', title: 'dicoding', body: 'dicoding',
      });
      const payload = {
        content: 'dicoding',
      };
      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload,

      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });
  describe('when DELETE /threads/{id}/comments/{idComment}', () => {
    it('should response 403 if thread cannot access,', async () => {
      const server = await createServer(injections);
      await UsersTableTestHelper.addUser({
        id: 'user-1234', username: 'anwar1', password: 'secret', fullname: 'anwar',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', owner: 'user-1234', title: 'dicoding', body: 'dicoding',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123', owner: 'user-1234', content: 'halo', threadId: 'thread-123',
      });

      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Kamu tidak dapat akses');
    });
    it('should response 200 and content is hide,', async () => {
      const server = await createServer(injections);
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'anwar', password: 'secret', fullname: 'anwar',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', owner: 'user-123', title: 'dicoding', body: 'dicoding',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123', owner: 'user-123', content: 'halo', threadId: 'thread-123',
      });

      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
  describe('when POST /threads/{id}/comments/{commentId}/replies', () => {
    it('should response 404 ', async () => {
      const server = await createServer(injections);
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'anwar', password: 'secret', fullname: 'anwar',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-8821', owner: 'user-123', title: 'dicoding', body: 'dicoding',
      });
      const payload = {
        content: 'dicoding',
      };
      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload,

      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread not found');
    });
    it('should response 201 and create new reply', async () => {
      const server = await createServer(injections);
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'anwar', password: 'secret', fullname: 'anwar',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', owner: 'user-123', title: 'dicoding', body: 'dicoding',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123', owner: 'user-123', content: 'dicoding', threadId: 'thread-123',
      });
      const payload = {
        content: 'dicoding',
      };
      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload,

      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe('when DELETE /threads/{id}/comments/{idComment}/replies', () => {
    it('should response 403 if thread cannot access,', async () => {
      const server = await createServer(injections);
      await UsersTableTestHelper.addUser({
        id: 'user-1234', username: 'anwar1', password: 'secret', fullname: 'anwar',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', owner: 'user-1234', title: 'dicoding', body: 'dicoding',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123', owner: 'user-1234', content: 'halo', threadId: 'thread-123',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', owner: 'user-1234', content: 'dicoding', threadId: 'thread-123', commentId: 'comment-123',
      });

      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Kamu tidak dapat akses');
    });
    it('should response 200 and content is hide,', async () => {
      const server = await createServer(injections);
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'anwar', password: 'secret', fullname: 'anwar',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', owner: 'user-123', title: 'dicoding', body: 'dicoding',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123', owner: 'user-123', content: 'halo', threadId: 'thread-123',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', owner: 'user-123', content: 'dicoding', threadId: 'thread-123', commentId: 'comment-123',
      });

      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
  describe('when PUT /threads/{id}/comments/{idComment}/likes', () => {
    it('should response 401 if token is not found,', async () => {
      const server = await createServer(injections);

      const accessToken = '';

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });
    it('should response 200 ,', async () => {
      const server = await createServer(injections);
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'anwar', password: 'secret', fullname: 'anwar',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', owner: 'user-123', title: 'dicoding', body: 'dicoding',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123', owner: 'user-123', content: 'halo', threadId: 'thread-123',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', owner: 'user-123', content: 'dicoding', threadId: 'thread-123', commentId: 'comment-123',
      });

      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
