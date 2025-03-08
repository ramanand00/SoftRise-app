const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let uploadPath = 'uploads/'
    
    switch (file.fieldname) {
      case 'video':
        uploadPath += 'videos/'
        break
      case 'document':
        uploadPath += 'documents/'
        break
      case 'thumbnail':
        uploadPath += 'thumbnails/'
        break
      case 'avatar':
        uploadPath += 'avatars/'
        break
      default:
        uploadPath += 'misc/'
    }
    
    cb(null, uploadPath)
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex')
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = {
    video: ['video/mp4', 'video/webm'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    thumbnail: ['image/jpeg', 'image/png', 'image/webp'],
    avatar: ['image/jpeg', 'image/png', 'image/webp'],
  }

  if (allowedMimeTypes[file.fieldname]?.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type. Allowed types for ${file.fieldname}: ${allowedMimeTypes[file.fieldname]?.join(', ')}`), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max file size
  }
})

// Upload middleware for different file types
const uploadVideo = upload.single('video')
const uploadDocument = upload.single('document')
const uploadThumbnail = upload.single('thumbnail')
const uploadAvatar = upload.single('avatar')

// Multiple files upload
const uploadLessonContent = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'document', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
])

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Maximum file size is 100MB'
      })
    }
    return res.status(400).json({
      error: err.code,
      message: err.message
    })
  }
  
  if (err) {
    return res.status(400).json({
      error: 'Upload failed',
      message: err.message
    })
  }
  
  next()
}

// Validation middleware
const validateUpload = (req, res, next) => {
  if (!req.file && !req.files) {
    return res.status(400).json({
      error: 'No file uploaded',
      message: 'Please select a file to upload'
    })
  }
  next()
}

module.exports = {
  uploadVideo,
  uploadDocument,
  uploadThumbnail,
  uploadAvatar,
  uploadLessonContent,
  handleUploadError,
  validateUpload,
} 