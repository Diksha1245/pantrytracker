import { useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

export default function IntroPage({ onAuthSuccess }) {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log('User:', user) 
      onAuthSuccess(user)  // Call the parent component's callback
    } catch (error) {
      console.error('Authentication failed:', error)
      setLoading(false)
    }
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
      sx={{
        backgroundImage: 'url(/pantryshot1-1-1140x700.jpg)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',

      }}
    >
      <Typography variant="h3" color="black" sx={{ fontWeight: 700, fontSize: 36 }}>
        Welcome to the Inventory Management System
      </Typography>
      <Typography variant="h6" sx={{ fontSize: 18, color: 'white' }}>
        Please sign in to continue
      </Typography>
      <Button
        variant="contained"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </Button>
    </Box>
  )
}
