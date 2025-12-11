import { Box, Typography } from '@mui/material'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
  noPadding?: boolean
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, noPadding = false, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: noPadding ? 0 : 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

export default TabPanel
