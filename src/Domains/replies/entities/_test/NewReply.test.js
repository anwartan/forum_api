const messages = require('../../../../Utils/messages');
const NewReply = require('../NewReply');

describe('a NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'dicoding',
      owner: 'Dicoding Indonesia',
    };

    expect(() => new NewReply(payload)).toThrowError(messages['REPLY.NOT_CONTAIN_NEEDED_PROPERTY']);
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 'dicoding', owner: 'owner', threadId: 123, commentId: 123,
    };

    expect(() => new NewReply(payload)).toThrowError(messages['REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION']);
  });

  it('should create newReply object correctly', () => {
    const payload = {
      content: 'dicoding', owner: 'owner', threadId: 'thread-123', commentId: 'comment-123',
    };

    const reply = new NewReply(payload);

    expect(reply.id).toEqual(payload.id);
    expect(reply.owner).toEqual(payload.owner);
    expect(reply.threadId).toEqual(payload.threadId);
    expect(reply.commentId).toEqual(payload.commentId);
  });
});
