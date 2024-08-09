'use client'
import IntroPage from './intropage'
import { useState, useEffect } from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { Add, Remove } from '@mui/icons-material'
import { Box, Stack, Typography, Button, Modal, TextField, IconButton} from '@mui/material'
import { firestore } from '@/firebase'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [user, setUser] = useState(null)
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
        updateInventory(user.uid)
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  const updateInventory = async (userId) => {
    const userInventoryCollection = collection(firestore, 'users', userId, 'inventory')
    const docs = await getDocs(userInventoryCollection)
    if (docs.empty) return
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    if (!user) return
    const normalizedItem = item.toLowerCase()
    const docRef = doc(collection(firestore, 'users', user.uid, 'inventory'), normalizedItem)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory(user.uid)
  }

  const removeItem = async (item) => {
    if (!user) return
    const normalizedItem = item.toLowerCase()
    const docRef = doc(collection(firestore, 'users', user.uid, 'inventory'), normalizedItem)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory(user.uid)
  }

  const handleLogout = async () => {
    try {
      await signOut(getAuth())
      setUser(null)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  if (!user) {
    return <IntroPage onAuthSuccess={(user) => setUser(user)} />
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={3}
      sx={{
        bgcolor: '#f5f5f5',
        padding: 3,
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" color="primary">
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      
      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add New Item
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Stack>

      <Box
        width="50%"
        borderRadius={2}
        boxShadow={2}
        sx={{
          bgcolor: '#ffffff',
          border: '1px solid #ccc',
        }}
      >
        <Box
          width="100%"
          height="80px"
          bgcolor="primary.main"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="8px 8px 0 0"
        >
          <Typography variant="h4" color="#fff" textAlign="center">
            Inventory Items
          </Typography>
        </Box>

        <Stack
          width="100%"
          spacing={2}
          padding={2}
          sx={{
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="100px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#f9f9f9"
              paddingX={3}
              borderRadius={2}
              boxShadow={1}
            >
             <Typography variant="h5" color="text.primary" textAlign="left">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton color="primary" onClick={() => removeItem(name)}>
                  <Remove />
                </IconButton>
                <Typography variant="h6" color="text.secondary" textAlign="center">
                  {quantity}
                </Typography>
                <IconButton color="primary" onClick={() => addItem(name)}>
                  <Add />
                </IconButton>
                </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
