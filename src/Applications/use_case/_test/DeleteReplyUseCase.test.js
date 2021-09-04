const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const Reply = require('../../../Domains/replies/entities/Reply');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error if username is not equal', async () => {
    const params = {
      idThread: 'thread-123',
      idComment: 'comment-123',
      idReply: 'reply-123',
    };
    const credential = {
      username: 'admin',
    };
    const payload = {};
    const expectedGetReply = new Reply({
      id: 'comment-123',
      content: 'dicoding',
      username: 'user-123123',
      created_at: '2021-08-22T13:52:54.016+07:00',
      is_delete: 0,
    });
    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.getReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetReply));
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    await expect(deleteReplyUseCase.execute(payload, credential, params))
      .rejects
      .toThrowError('Kamu tidak dapat akses');
  });

  it('should orchestrating the delete reply action correctly', async () => {
    const params = {
      idThread: 'thread-123',
      idComment: 'comment-123',
      idReply: 'reply-123',
    };
    const credential = {

      username: 'admin',
    };
    const payload = {};
    const expectedGetReply = new Reply({
      id: 'comment-123',
      content: 'dicoding',
      username: credential.username,
      created_at: '2021-08-22T13:52:54.016+07:00',
      is_delete: 0,
    });
    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.getReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetReply));
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    await deleteReplyUseCase.execute(payload, credential, params);

    expect(mockReplyRepository.getReplyById).toHaveBeenCalledWith(params.idReply);
    expect(mockReplyRepository.deleteReply)
      .toHaveBeenCalledWith(params.idReply, params.idThread, params.idComment);
  });
});
