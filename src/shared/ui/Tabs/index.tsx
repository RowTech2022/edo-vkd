import * as React from 'react'
import { Tab as TabLib, Tabs as TabsLib } from '@mui/material'
import TabPanel from './TabPanel'

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const Tab = (props: any) => <TabLib {...props} {...a11yProps(0)} />

const Tabs = (props: any) => <TabsLib {...props} />

export { Tab, Tabs, TabPanel }
