import { useState } from 'react'
import { Box, Button, Modal, SxProps, Theme, Typography } from '@mui/material'

function App() {
  const [open, setOpen] = useState(false)
  const code = `geofs-server-${crypto.randomUUID()}`

  const style: SxProps<Theme> = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
  }

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(!open)}>Get Code</Button>
      <Modal open={open} onClose={() => setOpen(!open)}>
        <Box sx={style}>
          <Typography>
            Your code: {code}
          </Typography>
        </Box>
      </Modal>
    </>
  )
}

export default App
