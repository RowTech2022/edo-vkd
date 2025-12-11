import styled from '@emotion/styled'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import { SyntheticEvent, useState } from 'react'
import Groups from './Groups'
import Profiles from './Profiles'
import Roles from './Roles'

const StyledTabList = styled(TabList)`
  background-color: #e2e2ea;

  .MuiButtonBase-root {
    min-width: 200px;
  }

  .MuiButtonBase-root.Mui-selected {
    color: black;
    background-color: white;
  }

  .MuiTabs-indicator {
    display: none;
  }
`

export default function Admin() {
  const [value, setValue] = useState('roles')
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <div className="tw-container tw-my-4">
      <Paper elevation={0} className="tw-overflow-hidden">
        <TabContext value={value}>
          <StyledTabList onChange={handleChange}>
            <Tab label="Пользователи" value="users" />
            <Tab label="Роли" value="roles" />
            <Tab label="Группы" value="groups" />
          </StyledTabList>
          <TabPanel value="users">
            <Profiles />
          </TabPanel>
          <TabPanel value="roles">
            <Roles />
          </TabPanel>
          <TabPanel value="groups">
            <Groups />
          </TabPanel>
        </TabContext>
      </Paper>
    </div>
  )
}
