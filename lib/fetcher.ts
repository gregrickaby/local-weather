/**
 * Generic fetching interface.
 *
 * @author Greg Rickaby
 * @param  {string}          url The url to fetch.
 * @return {Promise<string>}     The fetched data.
 */
export default async function fetcher(url: string) {
  return await fetch(url).then((res) => res.json())
}
