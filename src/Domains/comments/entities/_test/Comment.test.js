const messages = require('../../../../Utils/messages');
const Comment = require('../Comment');

describe('a Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'dicoding',
      username: 'Dicoding Indonesia',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError(messages['COMMENT.NOT_CONTAIN_NEEDED_PROPERTY']);
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123, content: 'dicoding', username: 'dicoding', created_at: '2021-08-22T13:52:54.016+07:00', is_delete: '',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError(messages['COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION']);
  });

  it('should create newComment object with delete message', () => {
    // Arrange
    const payload = {
      id: 'comment-123', content: 'dicoding', username: 'dicoding', created_at: '2021-08-22T13:52:54.016+07:00', is_delete: 1,
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.content).toEqual('**komentar telah dihapus**');
  });
  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123', content: 'dicoding', username: 'dicoding', created_at: '2021-08-22T13:52:54.016+07:00', is_delete: 0,
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.content).toEqual(payload.content);
  });
});
