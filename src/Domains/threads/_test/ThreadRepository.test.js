const messages = require('../../../Utils/messages');
const ThreadRepository = require('../ThreadRepository');

describe('AuthenticationRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    await expect(threadRepository.addThread('', '', '')).rejects.toThrowError(messages['THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED']);
    await expect(threadRepository.getThread('')).rejects.toThrowError(messages['THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED']);
  });
});
