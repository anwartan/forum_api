const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const { threadRepository } = require('../../injections');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const { addReply } = require('../../../../tests/RepliesTableTestHelper');

describe('ReplyRepositoryPostgres', () => {
  it('should be instance of ReplyRepositoryPostgres domain', () => {
    const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {}); // dummy dependency

    expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepositoryPostgres);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await RepliesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addReply function', () => {
      it('should persist new reply and return added reply correctly', async () => {
        const newReply = new NewReply({
          owner: 'anwar',
          content: 'dicoding',
          threadId: 'thread-321',
          commentId: 'comment-321',
        });
        const fakeIdGenerator = () => '123';
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
        const addedReply = await replyRepositoryPostgres
          .addReply(newReply);

        const reply = await RepliesTableTestHelper.findRepliesById(addedReply.id);
        expect(addedReply).toStrictEqual(new AddedReply({
          id: 'reply-123',
          content: newReply.content,
          owner: newReply.owner,
        }));
        expect(reply).toHaveLength(1);
      });
    });

    describe('delete Reply', () => {
      it('should update is_delete to true', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
        const data = {
          id: 'comment-123',
          owner: 'dicoding',
          content: 'dicoding',
          threadId: 'thread-123',
        };
        const dataReply = {
          id: 'reply-123', owner: 'dicoding', content: 'dicoding', threadId: 'thread-123', commentId: 'comment-123',
        };
        await CommentsTableTestHelper.addComment(data);
        await RepliesTableTestHelper.addReply(dataReply);
        await replyRepositoryPostgres.deleteReply('reply-123', 'thread-123', 'comment-123');
        const getReply = await RepliesTableTestHelper.findRepliesById('reply-123');
        expect(getReply).toHaveLength(1);
        expect(getReply[0].is_delete).toEqual(1);
      });
    });

    describe('getReplyByCommentId', () => {
      it('should get reply by comment id', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
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
          commentId: 'comment-123',
        };
        await UsersTableTestHelper.addUser(user);
        await ThreadsTableTestHelper.addThread(thread);
        await CommentsTableTestHelper.addComment(data1);
        await RepliesTableTestHelper.addReply(data2);

        const getReply = await replyRepositoryPostgres.getReplyByCommentId(data2.commentId);

        expect(getReply).toHaveLength(1);
      });
    });

    describe('getReplyById', () => {
      it('should throw NotFoundError when comment not found', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        await expect(replyRepositoryPostgres.getReplyById('reply-123')).rejects
          .toThrowError(NotFoundError);
      });
      it('should get reply by id', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
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
          id: 'reply-124',
          owner: user.id,
          content: 'dicoding',
          threadId: thread.id,
          commentId: 'comment-123',
        };
        await UsersTableTestHelper.addUser(user);
        await ThreadsTableTestHelper.addThread(thread);
        await CommentsTableTestHelper.addComment(data1);
        await RepliesTableTestHelper.addReply(data2);

        const getReply = await replyRepositoryPostgres.getReplyById(data2.id);

        expect(getReply.id).toEqual(data2.id);
      });
    });
  });
});
