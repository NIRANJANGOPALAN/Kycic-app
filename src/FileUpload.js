import { useState } from "react"
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function FileUpload() {
  const [files, setFiles] = useState([])
  const [error, setError] = useState(null)

  const MAX_FILES = 10
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (files.length + selectedFiles.length > MAX_FILES) {
      setError(`You can only upload a maximum of ${MAX_FILES} files.`)
      return
    }
    const oversizedFiles = selectedFiles.filter((file) => file.size > MAX_FILE_SIZE)
    if (oversizedFiles.length > 0) {
      setError(`File must not exceed ${MAX_FILE_SIZE / 1024 / 1024}MB in size.`)
      return
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg"]
    const invalidFiles = selectedFiles.filter((file) => !allowedTypes.includes(file.type))
    if (invalidFiles.length > 0) {
      setError("Only PDF and JPEG files are allowed.")
      return
    }

    const newFiles = [...files, ...selectedFiles]
    setFiles(newFiles)
    setError(null)
  }

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files]
    updatedFiles.splice(index, 1)
    setFiles(updatedFiles)
  }

  const calculateProgress = () => (files.length / MAX_FILES) * 100

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        File Upload
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <Box sx={{ marginBottom: 2 }}>
        <input
          id="file-input"
          type="file"
          multiple
          accept="application/pdf,image/jpeg,image/jpg"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-input">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            Choose Files
          </Button>
        </label>
      </Box>
      {files.length > 0 && (
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6" gutterBottom>
            Selected files: {files.length}
          </Typography>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                <Typography variant="body2" component="span">
                  {file.name}
                </Typography>
                <IconButton size="small" onClick={() => handleRemoveFile(index)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </li>
            ))}
          </ul>
        </Box>
      )}
      <Box sx={{ width: '100%', marginBottom: 2 }}>
        <LinearProgress variant="determinate" value={calculateProgress()} />
      </Box>
      <Button 
        type="submit" 
        variant="contained"
        disabled={files.length === 0} 
        fullWidth
      >
        Upload
      </Button>
    </Box>
  )
}