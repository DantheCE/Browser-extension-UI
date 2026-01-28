export default async function fileOpener(url = 'data.json') {
  if (typeof window === 'undefined') {
    const { readFile } = await import('fs/promises') // Dynamically import fs/promises
    try {
      const data = await readFile(url, 'utf8');
      return JSON.parse(data)
    } catch (err) {
      throw new Error(`Failed to load ${url}: ${err.message}`)
    }
  } else {
    // Browser environment
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`)
    return res.json();
  }
}