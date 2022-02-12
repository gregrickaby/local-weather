// Generic fetcher.
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default fetcher
