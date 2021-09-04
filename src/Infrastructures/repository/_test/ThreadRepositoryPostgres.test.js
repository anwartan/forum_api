const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {}); // dummy dependency

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addThread function', () => {
      it('should persist new user and return added user correctly', async () => {
        // Arrange

        const newThread = new NewThread({
          owner: 'anwar',
          title: 'dicoding',
          body: 'dicoding',
        });
        const fakeIdGenerator = () => '123'; // stub!
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const addedThread = await threadRepositoryPostgres
          .addThread(newThread);

        // Assert
        const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
        expect(addedThread).toStrictEqual(new AddedThread({
          id: 'thread-123',
          owner: newThread.owner,
          title: newThread.title,
        }));
        expect(threads).toHaveLength(1);
      });
    });

    describe('getThread', () => {
      it('should throw NotFoundError when thread not found', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(threadRepositoryPostgres.getThread('dicoding'))
          .rejects
          .toThrowError(NotFoundError);
      });

      it('should return thread id correctly', async () => {
        const thread = {
          id: 'thread-123',
          owner: 'user-123',
          title: 'dicoding',
          body: 'dicoding',
        };
        await UsersTableTestHelper.addUser({
          id: 'user-123', username: 'anwar', password: 'secret', fullname: 'anwar',
        });
        await ThreadsTableTestHelper.addThread(thread);

        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        const getThread = await threadRepositoryPostgres.getThread('thread-123');
        expect(getThread.id).toEqual('thread-123');
      });
    });
  });
});
