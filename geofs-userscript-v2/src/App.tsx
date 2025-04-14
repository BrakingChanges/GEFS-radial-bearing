import { useEffect, useState } from 'react'
import { Box, Button, Modal, SxProps, Theme, Typography } from '@mui/material'

function App() {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState({
    heading: null,
    altitude: null,
    lat: null,
    lon: null,
  })

  const style: SxProps<Theme> = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
  }

  useEffect(() => {
    // Function to send the current aircraft data to the server
    const updatePosition = () => {
      if (geofs?.aircraft?.instance?.llaLocation) {
        const postData = {
          lat: geofs.aircraft.instance.llaLocation[0],
          lon: geofs.aircraft.instance.llaLocation[1],
          altitude: geofs.aircraft.instance.llaLocation[2] * 3.28084, // Convert meters to feet
          heading: geofs.aircraft.instance.htr,
        }

        fetch('http://localhost:5000/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        }).catch((err) => console.error('POST error:', err))
      }
    }

    // Function to fetch current data from server (useful for viewer)
    const fetchData = () => {
      fetch('http://localhost:5000/data-get')
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.error('GET error:', err))
    }

    const postInterval = setInterval(updatePosition, 500)
    const getInterval = setInterval(fetchData, 1000)

    return () => {
      clearInterval(postInterval)
      clearInterval(getInterval)
    }
  }, [])

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Show Aircraft Info
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            Aircraft Position
          </Typography>
          <Typography>Latitude: {data.lat ?? 'N/A'}</Typography>
          <Typography>Longitude: {data.lon ?? 'N/A'}</Typography>
          <Typography>Altitude: {data.altitude ?? 'N/A'} ft</Typography>
          <Typography>Heading: {data.heading ?? 'N/A'}°</Typography>
        </Box>
      </Modal>
    </>
  )
}

export default App
