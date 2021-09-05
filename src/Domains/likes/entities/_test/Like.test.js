const messages = require('../../../../Utils/messages');
const Like = require('../Like');

describe('a AddedLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      owner: 'dicoding',
    };

    expect(() => new Like(payload)).toThrowError(messages['LIKE.NOT_CONTAIN_NEEDED_PROPERTY']);
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      owner: 'dicoding', commentId: 'comment-123', isLike: '1',
    };

    expect(() => new Like(payload)).toThrowError(messages['LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION']);
  });

  it('should create newComment object correctly', () => {
    const payload = {
      owner: 'dicoding', commentId: 'comment-123', isLike: 1,
    };

    const like = new Like(payload);

    expect(like.owner).toEqual(payload.owner);
    expect(like.commentId).toEqual(payload.commentId);
    expect(like.isLike).toEqual(payload.isLike);
  });
});
