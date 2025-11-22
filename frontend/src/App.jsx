import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  IconButton,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Alert
} from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './App.css'

const API_URL = 'http://localhost:8080/api/notes'

// Create theme function
const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    ...(mode === 'dark' ? {
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    } : {
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    }),
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
})

// Half Circular Progress Component
const HalfCircleProgress = ({ score, size = 70 }) => {
  const percentage = score || 0
  const radius = (size - 10) / 2
  const circumference = Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  const getColor = () => {
    if (percentage >= 80) return '#28a745'
    if (percentage >= 60) return '#ffc107'
    return '#dc3545'
  }

  return (
    <Box sx={{ position: 'relative', width: size, height: size / 2 + 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size / 2 + 5} viewBox={`0 0 ${size} ${size / 2 + 5}`}>
        <path
          d={`M 5 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 5} ${size / 2}`}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d={`M 5 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 5} ${size / 2}`}
          fill="none"
          stroke={getColor()}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          bottom: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          fontWeight: 700,
          color: getColor(),
          fontSize: '0.75rem'
        }}
      >
        {percentage.toFixed(0)}%
      </Typography>
    </Box>
  )
}

function App() {
  const [notes, setNotes] = useState([])
  const [editingNote, setEditingNote] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '' })
  const [loading, setLoading] = useState(false)
  const [checkingGrammar, setCheckingGrammar] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewingNote, setViewingNote] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  const theme = getTheme(darkMode ? 'dark' : 'light')

  useEffect(() => {
    fetchNotes()
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL)
      setNotes(response.data)
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }

  const handleOpenDialog = (note = null) => {
    if (note) {
      setEditingNote(note)
      setFormData({ title: note.title, content: note.content })
    } else {
      setEditingNote(null)
      setFormData({ title: '', content: '' })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingNote(null)
    setFormData({ title: '', content: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingNote) {
        await axios.put(`${API_URL}/${editingNote.id}`, formData)
      } else {
        await axios.post(API_URL, formData)
      }
      handleCloseDialog()
      await fetchNotes()
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Error saving note. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (note) => {
    setNoteToDelete(note)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (noteToDelete) {
      try {
        await axios.delete(`${API_URL}/${noteToDelete.id}`)
        setDeleteDialogOpen(false)
        setNoteToDelete(null)
        fetchNotes()
      } catch (error) {
        console.error('Error deleting note:', error)
        alert('Error deleting note. Please try again.')
      }
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setNoteToDelete(null)
  }

  const handleNoteClick = (note) => {
    setViewingNote(note)
    setViewDialogOpen(true)
  }

  const handleCheckGrammar = async (id, e) => {
    e.stopPropagation()
    setCheckingGrammar(id)
    try {
      await axios.post(`${API_URL}/${id}/check-grammar`)
      await fetchNotes()
    } catch (error) {
      console.error('Error checking grammar:', error)
      alert('Error checking grammar. Please try again.')
    } finally {
      setCheckingGrammar(null)
    }
  }

  // Prepare data for graph
  const graphData = notes
    .filter(note => note.grammarScore != null)
    .map(note => ({
      name: note.title.length > 15 ? note.title.substring(0, 15) + '...' : note.title,
      score: note.grammarScore,
      fullName: note.title
    }))

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container" style={{ 
        background: darkMode 
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      }}>
        <div className="app-header">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                📝 Notes App with Grammar Checker
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, color: 'white' }}>
                Create, edit, and check grammar of your notes
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#fff',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#fff',
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ color: 'white', fontWeight: 600 }}>
                  {darkMode ? '🌙 Dark' : '☀️ Light'}
                </Typography>
              }
            />
          </Box>
        </div>

        <div className="main-content">
          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                📚 Your Notes
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip 
                  label={`${notes.length} ${notes.length === 1 ? 'note' : 'notes'}`}
                  color="primary"
                  sx={{ fontWeight: 600 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<span style={{ fontSize: '1.2rem' }}>+</span>}
                  onClick={() => handleOpenDialog()}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2
                  }}
                >
                  Add Note
                </Button>
              </Box>
            </Box>

            {notes.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h2" sx={{ mb: 2 }}>📝</Typography>
                <Typography variant="h6" color="text.secondary">
                  No notes yet. Click the + button to create your first note!
                </Typography>
              </Box>
            ) : (
              <List sx={{ width: '100%' }}>
                {notes.map((note) => (
                  <Paper
                    key={note.id}
                    elevation={2}
                    onClick={() => handleNoteClick(note)}
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      borderLeft: '4px solid',
                      borderColor: 'primary.main',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateX(4px)',
                        transition: 'all 0.3s ease'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <ListItem
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        py: 2,
                        px: 3
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', mb: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {note.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            📅 Created: {formatDate(note.createdDate)}
                            {note.modifiedDate && note.modifiedDate !== note.createdDate && (
                              <> • ✏️ Modified: {formatDate(note.modifiedDate)}</>
                            )}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }} onClick={(e) => e.stopPropagation()}>
                          {note.grammarScore != null ? (
                            <HalfCircleProgress score={note.grammarScore} />
                          ) : (
                            <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                              <Typography variant="caption" display="block">No score</Typography>
                            </Box>
                          )}
                          <IconButton
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenDialog(note)
                            }}
                            size="small"
                            title="Edit"
                          >
                            ✏️
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteClick(note)
                            }}
                            size="small"
                            title="Delete"
                          >
                            🗑️
                          </IconButton>
                        </Box>
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.secondary',
                          mb: 2,
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word',
                          maxHeight: 100,
                          overflow: 'auto',
                          pr: 1
                        }}
                      >
                        {note.content}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: 1, borderColor: 'divider' }} onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {note.grammarScore != null && (
                            <Chip
                              label={`📊 Grammar: ${note.grammarScore.toFixed(1)}%`}
                              color={note.grammarScore >= 80 ? 'success' : note.grammarScore >= 60 ? 'warning' : 'error'}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => handleCheckGrammar(note.id, e)}
                          disabled={checkingGrammar === note.id}
                          sx={{ ml: 'auto' }}
                        >
                          {checkingGrammar === note.id ? (
                            <>
                              <CircularProgress size={14} sx={{ mr: 1 }} />
                              Checking...
                            </>
                          ) : (
                            <>
                              ✓ Check Grammar
                            </>
                          )}
                        </Button>
                      </Box>
                    </ListItem>
                  </Paper>
                ))}
              </List>
            )}
          </Paper>

          {graphData.length > 0 && (
            <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
                📊 Grammar Scores Overview
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#666"
                      tick={{ fill: '#666' }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      stroke="#666"
                      tick={{ fill: '#666' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#667eea" 
                      strokeWidth={3}
                      dot={{ fill: '#667eea', r: 5 }}
                      activeDot={{ r: 7 }}
                      name="Grammar Score (%)" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          )}
        </div>

        {/* Enhanced Add/Edit Note Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { 
              borderRadius: 3,
              background: darkMode ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
            }
          }}
        >
          <DialogTitle sx={{ 
            pb: 1,
            background: darkMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '12px 12px 0 0'
          }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
              {editingNote ? '✏️ Edit Note' : '➕ Create New Note'}
            </Typography>
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ pt: 3 }}>
              <TextField
                autoFocus
                margin="dense"
                label="Title"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Content"
                fullWidth
                multiline
                rows={10}
                variant="outlined"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                sx={{ mb: 1 }}
              />
              {editingNote && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Grammar will be automatically checked when you save this note.
                </Alert>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
              <Button onClick={handleCloseDialog} color="inherit" variant="outlined">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #653a91 100%)',
                  }
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                    Saving...
                  </>
                ) : (
                  editingNote ? '💾 Update Note' : '✨ Create Note'
                )}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: 'error.main' }}>
              🗑️ Delete Note
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Are you sure you want to delete this note? This action cannot be undone.
            </Alert>
            {noteToDelete && (
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {noteToDelete.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {noteToDelete.content.substring(0, 100)}
                  {noteToDelete.content.length > 100 ? '...' : ''}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleDeleteCancel} color="inherit" variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Note Detail View Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { 
              borderRadius: 3,
              background: darkMode ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
            }
          }}
        >
          {viewingNote && (
            <>
              <DialogTitle sx={{ 
                pb: 1,
                background: darkMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '12px 12px 0 0'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                    {viewingNote.title}
                  </Typography>
                  <IconButton
                    onClick={() => setViewDialogOpen(false)}
                    sx={{ color: 'white' }}
                    title="Close"
                  >
                    ✕
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    📅 <strong>Created:</strong> {formatDate(viewingNote.createdDate)}
                  </Typography>
                  {viewingNote.modifiedDate && viewingNote.modifiedDate !== viewingNote.createdDate && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ✏️ <strong>Modified:</strong> {formatDate(viewingNote.modifiedDate)}
                    </Typography>
                  )}
                  {viewingNote.grammarScore != null && (
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Grammar Score:</strong>
                      </Typography>
                      <HalfCircleProgress score={viewingNote.grammarScore} size={100} />
                    </Box>
                  )}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.primary',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    lineHeight: 1.8,
                    fontSize: '1.1rem'
                  }}
                >
                  {viewingNote.content}
                </Typography>
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
                <Button
                  onClick={() => {
                    setViewDialogOpen(false)
                    handleOpenDialog(viewingNote)
                  }}
                  variant="outlined"
                  color="primary"
                >
                  ✏️ Edit
                </Button>
                <Button
                  onClick={() => {
                    setViewDialogOpen(false)
                    handleDeleteClick(viewingNote)
                  }}
                  variant="outlined"
                  color="error"
                >
                  🗑️ Delete
                </Button>
                <Button
                  onClick={() => {
                    setViewDialogOpen(false)
                    handleCheckGrammar(viewingNote.id, { stopPropagation: () => {} })
                  }}
                  variant="contained"
                  color="primary"
                  disabled={checkingGrammar === viewingNote.id}
                >
                  {checkingGrammar === viewingNote.id ? (
                    <>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      Checking...
                    </>
                  ) : (
                    '✓ Check Grammar'
                  )}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </div>
    </ThemeProvider>
  )
}

export default App
