const STATUS = {
    PUBLISHED: 'Published',
    UNPUBLISHED: 'Unpublished',
};

const MESSAGES = {
    ERROR: {
        SERVER: 'An error occurred on the server.',
        NOT_FOUND: 'The requested resource was not found.'
    },
    SUCCESS: {
        OPERATION_COMPLETED: 'The operation was completed successfully.'
    }
};

module.exports = {
    STATUS,
    MESSAGES
};
