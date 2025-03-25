export const getStreetName = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'YourAppName/1.0 (dominhhiep21102003glhd@gmail.com)'
      }
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    const road = data.address.road || 'Unnamed Road'
    const roadName = removeDiacritics(road)
    return roadName
  } catch (error) {
    console.error('Error fetching street name:', error)
    return 'Error fetching road name'
  }
}

const removeDiacritics = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/Ê/g, 'E')
    .replace(/ê/g, 'e')
    .replace(/Ô/g, 'O')
    .replace(/ô/g, 'o')
    .replace(/Ơ/g, 'o')
    .replace(/ơ/g, 'o')
    .toLowerCase()
}