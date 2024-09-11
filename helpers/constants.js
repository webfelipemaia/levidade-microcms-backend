const UPLOAD_PATH = {
    ROOT: '/storage/',                      // for any file
    CONTENT: '/storage/content/',           // for files and images associated with an article    
    PROFILE: '/storage/profile/',           // for files and images associated with a user
};

const FILESIZES = {
    "250 KB": 250 * 1024,                   // 250 KB em bytes
    "500 KB": 500 * 1024,                   // 500 KB em bytes
    "1 MB": 1 * 1024 * 1024,                // 1 MB em bytes
    "2 MB": 2 * 1024 * 1024,                // 2 MB em bytes
    "4 MB": 4 * 1024 * 1024,                // 4 MB em bytes
    "8 MB": 8 * 1024 * 1024,                // 8 MB em bytes
    "16 MB": 16 * 1024 * 1024,              // 16 MB em bytes
    "32 MB": 32 * 1024 * 1024,              // 32 MB em bytes
    "64 MB": 64 * 1024 * 1024,              // 64 MB em bytes
    "128 MB": 128 * 1024 * 1024,            // 128 MB em bytes
    "256 MB": 256 * 1024 * 1024,            // 256 MB em bytes
    "512 MB": 512 * 1024 * 1024,            // 512 MB em bytes
    "1 GB": 1 * 1024 * 1024 * 1024,         // 1 GB em bytes
    "2 GB": 2 * 1024 * 1024 * 1024          // 2 GB em bytes
  };

const FILETYPES = {
    image: "/jpeg|jpg|png|gif|bmp|tiff/",
    video: "/avi|wmv|mov|mkv|mp4/",
    text: "/txt|doc|docx|xls|xlsx|pdf/",
    audio: "/mp3|wav|aac|ogg|flac/",
    compressed: "/zip|rar|7z|gz|tar/",
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
    FILESIZES,
    FILETYPES,
    UPLOAD_PATH,
    MESSAGES
};
