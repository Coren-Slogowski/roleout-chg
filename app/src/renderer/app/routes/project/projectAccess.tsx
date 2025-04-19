import React, {FunctionComponent, useEffect, useMemo, useState} from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import UnstyledTableCell, {tableCellClasses} from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import {styled} from '@mui/material/styles'
import SchemaDataAccessPicker from '../../../features/databases/schemaDataAccessPicker'
import {useAppSelector} from '../../hooks'
import {max} from 'lodash'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import {Box, Select, Typography, useTheme} from '@mui/material'
import VirtualWarehouseAccessPicker from '../../../features/virtualWarehouses/virtualWarehouseAccessPicker'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import {SelectChangeEvent} from '@mui/material/Select'
import SchemaObjectGroupAccessPicker from '../../../features/schemaObjectGroups/schemaObjectGroupAccessPicker'
import {selectSchemaObjectGroups} from '../../../features/schemaObjectGroups/schemaObjectGroupsSlice'
import DatabaseDataAccessPicker from '../../../features/databases/databaseDataAccessPicker'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel: FunctionComponent<TabPanelProps> = (props: TabPanelProps) => {
  const {children, value, index, ...other} = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <React.Fragment>{children}</React.Fragment>
      )}
    </div>
  )
}

const ProjectAccess = () => {
  const databases = useAppSelector(state => state.databases)
  const schemaObjectGroups = useAppSelector(selectSchemaObjectGroups)
  const virtualWarehouses = useAppSelector(state => state.virtualWarehouses)
  const functionalRoles = useAppSelector(state => state.functionalRoles)
  const environmentsEnabled = useAppSelector(state => state.project.environmentsEnabled)
  const schemaObjectGroupsEnabled = useAppSelector(state => state.project.schemaObjectGroupsEnabled)
  const environments = useAppSelector(state => state.environments)

  const calculateMaxTableHeight = (windowHeight: number) => windowHeight - 180
  const calculateMaxTableWidth = (windowWidth: number) => windowWidth - 300
  const [environment, setEnvironment] = useState(environmentsEnabled && environments.length > 0 ? environments[0] : undefined)
  const [index, setIndex] = useState(0)
  const [maxTableHeight, setMaxTableHeight] = useState(calculateMaxTableHeight(window.innerHeight))
  const [maxTableWidth, setMaxTableWidth] = useState(calculateMaxTableWidth(window.innerWidth))

  const theme = useTheme()

  interface NameCellProps {
    solidBackground?: boolean
  }
  
  const NameCell = styled(UnstyledTableCell, {
    shouldForwardProp: (prop) => prop !== 'solidBackground',
  })<NameCellProps>(({theme, solidBackground}) => ({
    backgroundColor: solidBackground ? theme.palette.background.paper : 'transparent',
    color: theme.palette.text.primary,
    cursor: 'not-allowed',
    position: 'sticky',
    left: 0,
    zIndex: 1,
    borderRight: '1px solid',
    borderRightColor: theme.palette.divider,
    backgroundClip: 'padding-box',
    '&.database-column': {
      backgroundColor: 'black',
      color: 'white',
      fontWeight: 900,
    },
    '&.schema-name': {
      backgroundColor: '#0f0f0f',
      color: 'white',
      fontWeight: 400,
    }
  }))
  
  // Create a styled component for name header cells
  const NameHeaderCell = styled(UnstyledTableCell)(({theme}) => ({
    backgroundColor: theme.palette.background.paper, // solid background
    position: 'sticky',
    left: 0,
    top: 0,
    zIndex: 3,
    verticalAlign: 'bottom',
    backgroundClip: 'padding-box', // prevent bleed
  }))
  
  // Create a regular table cell component
  const TableCell = styled(UnstyledTableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.background.paper,
      position: 'sticky',
      top: 0
    },
    [`&.${tableCellClasses.head} span.nowrap`]: {
      whiteSpace: 'nowrap'
    },
    [`&.${tableCellClasses.head}.header`]: {
      verticalAlign: 'bottom'
    },
    [`&.${tableCellClasses.head}.rotated`]: {
      height: rotatedHeaderHeightInCh + 'ch',
      paddingBottom: '2px',
      verticalAlign: 'bottom',
    },
    [`&.${tableCellClasses.head}.rotated > div`]: {
      width: 30,
      transformOrigin: 'bottom left',
      transform: 'translateX(25px) rotate(-45deg)',
    },
    [`&.${tableCellClasses.body}`]: {
      borderRight: '1px solid',
      borderRightColor: theme.palette.divider
    },
  }))

  useEffect(() => {
    const handleResize = () => {
      setMaxTableHeight(calculateMaxTableHeight(window.innerHeight))
      setMaxTableWidth(calculateMaxTableWidth(window.innerWidth))
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const dataAccessChildren = useMemo(() => {
    return databases.map(database => (
      <React.Fragment key={database.name}>
        <TableRow>
          <NameCell className="database-column" solidBackground>{database.name}</NameCell>
          <NameCell></NameCell>
          {functionalRoles.map((functionalRole, i) => (
            <DatabaseDataAccessPicker key={functionalRole.name} databaseName={database.name}
              functionalRoleName={functionalRole.name} environmentName={environment?.name}
              state={database.access[functionalRole.name]?.find(a => a.environment === environment?.name)?.level}/>
          ))}
        </TableRow>
        {database.schemata.map((schema, i) => (
          <React.Fragment key={database.name + '.' + schema.name}>
            <TableRow>
              {i === 0 && <NameCell rowSpan={database.schemata.length} className="database-column" solidBackground />}
              <NameCell className="schema-name">{schema.name}</NameCell>
              {functionalRoles.map(functionalRole => (
                <SchemaDataAccessPicker key={functionalRole.name} databaseName={database.name} schemaName={schema.name}
                  functionalRoleName={functionalRole.name} environmentName={environment?.name}
                  databaseState={database.access[functionalRole.name]?.find(a => a.environment === environment?.name)?.level}
                  state={schema.access[functionalRole.name]?.find(a => a.environment === environment?.name)?.level}/>
              ))}
            </TableRow>
          </React.Fragment>
        ))}
      </React.Fragment>
    ))
  }, [databases, functionalRoles, environments, environment])

  const schemaObjectGroupAccessChildren = useMemo(() => {
    return schemaObjectGroups.map(schemaObjectGroup => (
      <React.Fragment key={schemaObjectGroup.name}>
        <TableRow>
          <NameCell>{schemaObjectGroup.name}</NameCell>

          {functionalRoles.map(functionalRole => (
            <SchemaObjectGroupAccessPicker key={functionalRole.name} schemaObjectGroupName={schemaObjectGroup.name}
              functionalRoleName={functionalRole.name} environmentName={environment?.name}
              state={schemaObjectGroup.access[functionalRole.name]?.find(a => a.environment === environment?.name)?.level}/>
          ))}
        </TableRow>
      </React.Fragment>
    ))
  }, [schemaObjectGroups, functionalRoles, environments, environment])

  const virtualWarehouseAccessChildren = useMemo(() => {
    return virtualWarehouses.map(virtualWarehouse => (
      <React.Fragment key={virtualWarehouse.name}>
        <TableRow>
          <NameCell solidBackground>{virtualWarehouse.name}</NameCell>

          {functionalRoles.map(functionalRole => (
            <VirtualWarehouseAccessPicker key={functionalRole.name} virtualWarehouseName={virtualWarehouse.name}
              functionalRoleName={functionalRole.name} environmentName={environment?.name}
              state={virtualWarehouse.access[functionalRole.name]?.find(a => a.environment === environment?.name)?.level}/>
          ))}
        </TableRow>
      </React.Fragment>
    ))
  }, [virtualWarehouses, functionalRoles, environments, environment])

  const rotatedHeaderHeightInCh = useMemo(() => {
    return (6 + Math.ceil(.707 * (max(functionalRoles.map(fr => fr.name.length)) ?? 140)))
  }, [functionalRoles])
  const rotatedHeaderRightPaddingInCh = useMemo(() => {
    return Math.ceil(rotatedHeaderHeightInCh / 2)
  }, [rotatedHeaderHeightInCh])

  const showSchemaObjectGroups = useMemo(() => {
    return schemaObjectGroupsEnabled && schemaObjectGroups.length > 0
  }, [schemaObjectGroups, schemaObjectGroupsEnabled])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setIndex(newValue)
  }

  const handleEnvironmentChange = (event: SelectChangeEvent) => {
    const newEnvironment = environments.find(env => env.name === event.target.value as string)
    setEnvironment(newEnvironment)
  }

  if (environmentsEnabled && environments.length === 0) {
    return (
      <Box sx={{width: '100%'}}>
        <Typography>You must add at least one environment before designing access.</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{minWidth: maxTableWidth, maxWidth: maxTableWidth}}>
      {environmentsEnabled && environments.length > 0 && (
        <Box display="flex" flexDirection="row-reverse">
          <FormControl sx={{maxWidth: 300, minWidth: 200}}>
            <InputLabel id="env-select-label">Environment</InputLabel>
            <Select
              labelId="env-select-label"
              id="env-select"
              value={environment?.name}
              label="Environment"
              onChange={handleEnvironmentChange}
            >
              {environments.map(env => (
                <MenuItem key={env.name} value={env.name}>{env.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
      <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs value={index} onChange={handleTabChange} aria-label="access tabs">
          <Tab label="Databases"/>
          {showSchemaObjectGroups &&
            <Tab label="Schema Object Groups"/>
          }
          <Tab label="Virtual Warehouses"/>
        </Tabs>
      </Box>
      <TabPanel value={index} index={0}>
        <TableContainer sx={{
          backgroundColor: theme.palette.background.paper,
          minHeight: maxTableHeight,
          maxHeight: maxTableHeight,
          pr: rotatedHeaderRightPaddingInCh + 'ch',
          overflow: 'auto'
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <NameHeaderCell className="header"><h3>Database</h3></NameHeaderCell>
                <NameHeaderCell className="header"><h3>Schema</h3></NameHeaderCell>
                {functionalRoles.map((fr, i) => (
                  <TableCell sx={{zIndex: functionalRoles.length - i}} key={fr.name} className="rotated">
                    <div><span className="nowrap">{fr.name}</span></div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody component={Paper}>
              {dataAccessChildren}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      {showSchemaObjectGroups &&
        <TabPanel value={index} index={1}>
          <TableContainer sx={{
            backgroundColor: theme.palette.background.paper,
            minHeight: maxTableHeight,
            maxHeight: maxTableHeight,
            pr: rotatedHeaderRightPaddingInCh + 'ch',
            overflow: 'auto'
          }}>
            <Table>
              <TableHead>
                <TableRow>
                  <NameHeaderCell className="header"><h3>Schema Object Group</h3></NameHeaderCell>
                  {functionalRoles.map((fr, i) => (
                    <TableCell sx={{zIndex: functionalRoles.length - i}} key={fr.name} className="rotated">
                      <div><span className="nowrap">{fr.name}</span></div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody component={Paper}>
                {schemaObjectGroupAccessChildren}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      }
      <TabPanel value={index} index={showSchemaObjectGroups ? 2 : 1}>
        <TableContainer sx={{
          backgroundColor: theme.palette.background.paper,
          minHeight: maxTableHeight,
          maxHeight: maxTableHeight,
          pr: rotatedHeaderRightPaddingInCh + 'ch',
          overflow: 'auto'
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <NameHeaderCell className="header"><h3>Virtual Warehouse</h3></NameHeaderCell>
                {functionalRoles.map((fr, i) => (
                  <TableCell sx={{zIndex: functionalRoles.length - i}} key={fr.name} className="rotated">
                    <div><span className="nowrap">{fr.name}</span></div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody component={Paper}>
              {virtualWarehouseAccessChildren}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Box>
  )
}

export default ProjectAccess