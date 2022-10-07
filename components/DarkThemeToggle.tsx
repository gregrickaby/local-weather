import {Switch, useMantineColorScheme} from '@mantine/core'

/**
 * Dark theme toggle component.
 */
export default function DarkThemeToggle() {
  const {colorScheme, toggleColorScheme} = useMantineColorScheme()

  return (
    <Switch
      aria-label="Toggle between light and theme."
      label="Toggle Dark Theme (⌘+J)"
      checked={colorScheme === 'dark'}
      offLabel="OFF"
      onChange={() => toggleColorScheme()}
      onLabel="ON"
      size="lg"
    />
  )
}
