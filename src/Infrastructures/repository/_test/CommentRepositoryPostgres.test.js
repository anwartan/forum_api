const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const { threadRepository } = require('../../injections');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {}); // dummy dependency

    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepositoryPostgres);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addComments function', () => {
      it('should persist new comment and return added comment correctly', async () => {
        const newComment = new NewComment({
          owner: 'anwar',
          content: 'dicoding',
          threadId: 'thread-321',
        });
        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        const addedComment = await commentRepositoryPostgres
          .addComment(newComment);

        const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
        expect(addedComment).toStrictEqual(new AddedComment({
          id: 'comment-123',
          content: newComment.content,
          owner: newComment.owner,
        }));
        expect(comments).toHaveLength(1);
      });
    });

    describe('deleteComment', () => {
      it('should update is_delete to true', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        const data = {
          id: 'comment-123',
          owner: 'dicoding',
          content: 'dicoding',
          threadId: 'thread-123',
        };
        const comments = await CommentsTableTestHelper.addComment(data);
        await commentRepositoryPostgres.deleteComment('comment-123', 'thread-123');
        const getComment = await CommentsTableTestHelper.findCommentsById('comment-123');
        expect(getComment).toHaveLength(1);
        expect(getComment[0].is_delete).toEqual(1);
      });
    });

    describe('getCommentByThreadId', () => {
      it('should get comments by thread id', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        const user = {
          id: 'user-123', username: 'anwar', password: 'secret', fullname: 'anwar',
        };
        const thread = {
          id: 'thread-333',
          owner: user.id,
          title: 'dicoding',
          body: 'dicoding',
        };
        const data1 = {
          id: 'comment-123',
          owner: user.id,
          content: 'dicoding',
          threadId: thread.id,
        };
        const data2 = {
          id: 'comment-124',
          owner: user.id,
          content: 'dicoding',
          threadId: thread.id,
        };
        await UsersTableTestHelper.addUser(user);
        await ThreadsTableTestHelper.addThread(thread);
        await CommentsTableTestHelper.addComment(data1);
        await CommentsTableTestHelper.addComment(data2);

        const getComment = await commentRepositoryPostgres.getCommentByThreadId(thread.id);

        expect(getComment).toHaveLength(2);
      });
    });

    describe('getCommentById', () => {
      it('should throw NotFoundError when comment not found', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        await expect(commentRepositoryPostgres.getCommentById('comment-123')).rejects
          .toThrowError(NotFoundError);
      });
      it('should get comments by id', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        const user = {
          id: 'user-123', username: 'anwar', password: 'secret', fullname: 'anwar',
        };
        const thread = {
          id: 'thread-333',
          owner: user.id,
          title: 'dicoding',
          body: 'dicoding',
        };
        const data1 = {
          id: 'comment-123',
          owner: user.id,
          content: 'dicoding',
          threadId: thread.id,
        };
        const data2 = {
          id: 'comment-124',
          owner: user.id,
          content: 'dicoding',
          threadId: thread.id,
        };
        await UsersTableTestHelper.addUser(user);
        await ThreadsTableTestHelper.addThread(thread);
        await CommentsTableTestHelper.addComment(data1);
        await CommentsTableTestHelper.addComment(data2);

        const getComment = await commentRepositoryPostgres.getCommentById(data1.id);

        expect(getComment.id).toEqual(data1.id);
      });
    });
  });
});
