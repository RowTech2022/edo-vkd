import { Box, IconButton, Tooltip } from '@mui/material'
import { FC, ReactNode } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { toast } from 'react-toastify'

interface ICopyCover {
  children?: ReactNode
  value: string
  withTooltip?: boolean
  className?: string
}

export const CopyCover: FC<ICopyCover> = ({
  value,
  children,
  withTooltip,
  className,
}) => {
  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value).then(() => {
        toast.success('Успешно скопирован')
      })
    }
  }

  const content = (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flex: 1 }}>{children}</Box>
      <IconButton onClick={handleCopy}>
        <ContentCopyIcon />
      </IconButton>
    </Box>
  )

  if (withTooltip) {
    return (
      <div className={className}>
        <Tooltip
          componentsProps={{
            tooltip: {
              sx: {
                maxWidth: '500px',
              },
            },
          }}
          placement="top-start"
          title={value}
        >
          {content}
        </Tooltip>
      </div>
    )
  }

  return <div className={className}>{content}</div>
}
