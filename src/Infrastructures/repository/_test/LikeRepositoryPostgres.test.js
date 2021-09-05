const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const pool = require('../../database/postgres/pool');
const { threadRepository } = require('../../injections');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const Like = require('../../../Domains/likes/entities/Like');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const { addReply } = require('../../../../tests/RepliesTableTestHelper');

describe('LikeRepositoryPostgres', () => {
  it('should be instance of LikeRepositoryPostgres domain', () => {
    const likeRepositoryPostgres = new LikeRepositoryPostgres({}, {}); // dummy dependency

    expect(likeRepositoryPostgres).toBeInstanceOf(LikeRepositoryPostgres);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await RepliesTableTestHelper.cleanTable();
      await LikesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addLike function', () => {
      it('should persist new like and return new like ', async () => {
        const newLike = new Like({ owner: 'user-123', commentId: 'comment-123', isLike: 1 });
        const fakeIdGenerator = () => '123';
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
        const addedLike = await likeRepositoryPostgres
          .addLike(newLike);

        const like = await LikesTableTestHelper.findLikesById(addedLike.id);
        expect(addedLike).toStrictEqual(newLike);
      });
    });

    describe('updatelike', () => {
      it('should update is_like ', async () => {
        // Arrange
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
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
        await LikesTableTestHelper.addLike({
          id: 'like123', owner: data.owner, commentId: data.id, isLike: 0,
        });
        await likeRepositoryPostgres.updateLike(data.owner, data.id, 1);
        const getLike = await LikesTableTestHelper.findLikesById('like123');
        expect(getLike).toHaveLength(1);
      });
    });

    describe('getLike', () => {
      it('should return null if like is not found', async () => {
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        const data2 = {
          id: 'like-124',
          owner: 'user-123',
          commentId: 'comment-123',
          isLike: 1,
        };

        const getLike = await likeRepositoryPostgres.getLike(data2.owner, data2.commentId);

        expect(getLike).toStrictEqual(null);
      });
      it('should get like by comment id and owner', async () => {
        // Arrange
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
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
          id: 'like-124',
          owner: user.id,
          commentId: 'comment-123',
          isLike: 1,
        };
        await UsersTableTestHelper.addUser(user);
        await ThreadsTableTestHelper.addThread(thread);
        await CommentsTableTestHelper.addComment(data1);
        await LikesTableTestHelper.addLike(data2);

        const getLike = await likeRepositoryPostgres.getLike(data2.owner, data2.commentId);

        expect(getLike).toStrictEqual(new Like({
          owner: user.id,
          commentId: 'comment-123',
          isLike: 1,
        }));
      });
    });

    describe('getLikes', () => {
      it('should get likes by comment id', async () => {
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
        const user = {
          id: 'user-123', username: 'anwar', password: 'secret', fullname: 'anwar',
        };
        const user1 = {
          id: 'user-1234', username: 'anwar1', password: 'secret', fullname: 'anwar1',
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
          id: 'like-124',
          owner: user.id,
          commentId: 'comment-123',
          isLike: 1,
        };
        const data3 = {
          id: 'like-125',
          owner: user1.id,
          commentId: 'comment-123',
          isLike: 1,
        };
        await UsersTableTestHelper.addUser(user);
        await UsersTableTestHelper.addUser(user1);
        await ThreadsTableTestHelper.addThread(thread);
        await CommentsTableTestHelper.addComment(data1);
        await LikesTableTestHelper.addLike(data2);
        await LikesTableTestHelper.addLike(data3);
        const getLikes = await likeRepositoryPostgres.getLikes(data2.commentId);

        expect(getLikes).toHaveLength(2);
      });
    });
  });
});
