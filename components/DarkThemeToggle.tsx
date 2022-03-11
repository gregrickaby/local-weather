import {Switch, useMantineColorScheme} from '@mantine/core'

export default function DarkThemeToggle() {
  const {colorScheme, toggleColorScheme} = useMantineColorScheme()
  const dark = colorScheme === 'dark'

  return (
    <Switch
      aria-label="Toggle between light and theme."
      label="Dark Theme"
      checked={dark}
      offLabel="OFF"
      onChange={() => toggleColorScheme()}
      onLabel="ON"
      size="lg"
    />
  )
}
