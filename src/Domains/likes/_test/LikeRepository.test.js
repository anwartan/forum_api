const messages = require('../../../Utils/messages');
const LikeRepository = require('../LikeRepository');

describe('LikeRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action & Assert
    await expect(likeRepository.addLike('', '', 0)).rejects.toThrowError(messages['LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED']);
    await expect(likeRepository.updateLike('', '', 0)).rejects.toThrowError(messages['LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED']);
    await expect(likeRepository.getLike('', '')).rejects.toThrowError(messages['LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED']);
    await expect(likeRepository.getLikes('')).rejects.toThrowError(messages['LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED']);
  });
});
