'use client'

import config from '@/lib/config'
import {useAppDispatch, useAppSelector} from '@/lib/store/hooks'
import {
  clearSearchHistory,
  setColorScheme,
  setTempUnit
} from '@/lib/store/slices/preferencesSlice'
import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Modal,
  Stack,
  Switch,
  Text,
  useMantineColorScheme
} from '@mantine/core'
import {useDisclosure, useHotkeys} from '@mantine/hooks'
import {IconSettings, IconTrash} from '@tabler/icons-react'
import {useEffect, useState} from 'react'
import classes from './Settings.module.css'

/**
 * Settings component.
 */
export default function Settings() {
  const [opened, {open, close}] = useDisclosure(false)
  const {
    colorScheme: mantineColorScheme,
    setColorScheme: setMantineColorScheme
  } = useMantineColorScheme()
  const dispatch = useAppDispatch()
  const tempUnit = useAppSelector((state) => state.preferences.tempUnit)
  const searchHistory = useAppSelector(
    (state) => state.preferences.searchHistory
  )
  const [checked, setChecked] = useState(tempUnit === 'f')

  // Sync temp unit checked state
  useEffect(() => {
    setChecked(tempUnit === 'f')
  }, [tempUnit])

  function toggleTempUnit() {
    const newUnit = checked ? 'c' : 'f'
    setChecked(!checked)
    dispatch(setTempUnit(newUnit))
  }

  function toggleColorScheme() {
    const newScheme = mantineColorScheme === 'dark' ? 'light' : 'dark'
    setMantineColorScheme(newScheme)
    dispatch(setColorScheme(newScheme))
  }

  function handleClearHistory() {
    dispatch(clearSearchHistory())
  }

  useHotkeys([['mod+u', () => toggleTempUnit()]])

  return (
    <>
      <ActionIcon
        aria-label="open settings"
        className={classes.settings}
        onClick={open}
        size={48}
        variant="transparent"
      >
        <IconSettings size={48} />
      </ActionIcon>
      <Modal
        closeButtonProps={{'aria-label': 'close settings'}}
        onClose={close}
        opened={opened}
        padding="xl"
        title="Settings"
      >
        <Stack justify="space-between">
          <Switch
            aria-label="Toggle between light and theme."
            label="Toggle Dark Theme (⌘+J)"
            checked={mantineColorScheme === 'dark'}
            offLabel="OFF"
            onChange={() => toggleColorScheme()}
            onLabel="ON"
            size="lg"
          />
          <Switch
            aria-label="Toggle between Fahrenheit and Celsius"
            label="Toggle Fahrenheit (⌘+U)"
            checked={checked}
            offLabel="OFF"
            onChange={() => toggleTempUnit()}
            onLabel="ON"
            size="lg"
          />
          {searchHistory.length > 0 && (
            <>
              <Divider />
              <div>
                <Text size="sm" fw={500} mb="xs">
                  Search History ({searchHistory.length})
                </Text>
                <Button
                  leftSection={<IconTrash size={16} />}
                  variant="light"
                  color="red"
                  fullWidth
                  onClick={handleClearHistory}
                  size="sm"
                >
                  Clear History
                </Button>
              </div>
            </>
          )}
          <Flex
            gap="md"
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
          >
            Thank you for using {config.siteName}! Would you consider sponsoring
            further development for just $5?
            <iframe
              src="https://github.com/sponsors/gregrickaby/button"
              title="Sponsor gregrickaby"
              height="32"
              width="114"
              style={{border: '0', borderRadius: '6px'}}
            />
          </Flex>
        </Stack>
      </Modal>
    </>
  )
}
