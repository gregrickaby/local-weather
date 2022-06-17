import {Button, Group, Modal, Space} from '@mantine/core'
import {GearIcon} from '@modulz/radix-icons'
import {useState} from 'react'
import DarkThemeToggle from '~/components/DarkThemeToggle'
import TempUnitToggle from '~/components/TempUnitToggle'

export default function Settings() {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Modal onClose={() => setOpened(false)} opened={opened} title="Settings">
        <DarkThemeToggle />
        <Space h="md" />
        <TempUnitToggle />
        <Space h="md" />
      </Modal>

      <Group
        sx={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          zIndex: 100
        }}
      >
        <Button
          aria-label="open settings"
          color="gray"
          onClick={() => setOpened(true)}
          variant="subtle"
        >
          <GearIcon />
        </Button>
      </Group>
    </>
  )
}
