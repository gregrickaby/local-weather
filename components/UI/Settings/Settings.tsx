'use client'

import config from '@/lib/constants/config'
import {useAppDispatch, useAppSelector} from '@/lib/store/hooks'
import {
  clearFavorites,
  removeFromFavorites,
  setColorScheme,
  setLocation
} from '@/lib/store/slices/preferencesSlice'
import type {Location} from '@/lib/types'
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Switch,
  Text,
  useMantineColorScheme
} from '@mantine/core'
import {useDisclosure} from '@mantine/hooks'
import {IconHeart, IconSettings, IconTrash} from '@tabler/icons-react'
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
  const favorites = useAppSelector((state) => state.preferences.favorites)

  function toggleColorScheme() {
    const newScheme = mantineColorScheme === 'dark' ? 'light' : 'dark'
    setMantineColorScheme(newScheme)
    dispatch(setColorScheme(newScheme))
  }

  function handleClearFavorites() {
    dispatch(clearFavorites())
  }

  function handleRemoveFavorite(locationId: number) {
    dispatch(removeFromFavorites(locationId))
  }

  function handleSelectFavorite(favorite: Location) {
    dispatch(setLocation(favorite))
    close()
  }

  return (
    <>
      <ActionIcon
        aria-label="open settings"
        className={classes.settings}
        onClick={open}
        size={36}
        variant="transparent"
      >
        <IconSettings size={24} />
      </ActionIcon>
      <Modal
        closeButtonProps={{'aria-label': 'close settings'}}
        onClose={close}
        opened={opened}
        padding="xl"
        title="Settings"
        size="md"
        centered
      >
        <Stack gap="lg">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="sm" fw={500} mb="sm">
              Appearance
            </Text>
            <Switch
              aria-label="Toggle between light and dark theme."
              label="Dark Mode"
              checked={mantineColorScheme === 'dark'}
              onChange={() => toggleColorScheme()}
              size="md"
            />
          </Card>

          {favorites.length > 0 && (
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="sm">
                <Text size="sm" fw={500}>
                  Favorites
                </Text>
                <Button
                  leftSection={<IconTrash size={16} />}
                  variant="subtle"
                  color="red"
                  onClick={handleClearFavorites}
                  size="xs"
                >
                  Clear All
                </Button>
              </Group>
              <Stack gap="xs">
                {favorites.map((fav) => (
                  <Group key={fav.id} justify="space-between" wrap="nowrap">
                    <Button
                      variant="light"
                      fullWidth
                      onClick={() => handleSelectFavorite(fav)}
                      style={{flex: 1}}
                      size="sm"
                    >
                      {fav.display}
                    </Button>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      aria-label={`Remove ${fav.display} from favorites`}
                      onClick={() => handleRemoveFavorite(fav.id)}
                      size="md"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ))}
              </Stack>
            </Card>
          )}

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="sm" align="center">
              <Text size="sm" ta="center">
                Thank you for using {config.siteName}! Would you consider
                sponsoring further development?
              </Text>
              <Button
                component="a"
                href="https://github.com/sponsors/gregrickaby"
                target="_blank"
                rel="noopener noreferrer"
                leftSection={<IconHeart size={16} />}
                variant="light"
                color="pink"
                size="sm"
              >
                Sponsor on GitHub
              </Button>
            </Stack>
          </Card>
        </Stack>
      </Modal>
    </>
  )
}
