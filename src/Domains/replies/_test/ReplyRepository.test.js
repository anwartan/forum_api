const messages = require('../../../Utils/messages');
const ReplyRepository = require('../ReplyRepository');

describe('AuthenticationRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action & Assert
    await expect(replyRepository.addReply('', '', '', '')).rejects.toThrowError(messages['REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED']);
    await expect(replyRepository.deleteReply('', '', '')).rejects.toThrowError(messages['REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED']);
    await expect(replyRepository.getReplyById('')).rejects.toThrowError(messages['REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED']);
    await expect(replyRepository.getReplyByCommentId('')).rejects.toThrowError(messages['REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED']);
  });
});
