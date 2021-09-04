const messages = require('../../../Utils/messages');
const CommentRepository = require('../CommentRepository');

describe('AuthenticationRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action & Assert
    await expect(commentRepository.addComment('', '', '')).rejects.toThrowError(messages['COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED']);
    await expect(commentRepository.deleteComment('', '')).rejects.toThrowError(messages['COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED']);
    await expect(commentRepository.getCommentById('')).rejects.toThrowError(messages['COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED']);
    await expect(commentRepository.getCommentByThreadId('')).rejects.toThrowError(messages['COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED']);
  });
});
