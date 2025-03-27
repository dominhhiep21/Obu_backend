// export const haversineDistance = (lat1, lng1, lat2, lng2) => {
//   const toRad = (angle) => (angle * Math.PI) / 180
//   const R = 6371e3// Bán kính Trái Đất tính bằng mét

//   // Chuyển đổi toàn bộ giá trị sang radian trước khi tính toán
//   const φ1 = toRad(lat1)
//   const φ2 = toRad(lat2)
//   const Δφ = toRad(lat2 - lat1)
//   const Δλ = toRad(lng2 - lng1)

//   const a =
//       Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//       Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

//   return R * c // Khoảng cách tính bằng mét
// }
export const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Bán kính trái đất
  const toRadians = degree => degree * (Math.PI / 180)

  const φ1 = toRadians(lat1)
  const φ2 = toRadians(lat2)
  const Δφ = toRadians(lat2 - lat1)
  const Δλ = toRadians(lng2 - lng1)

  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c * 1000// Khoảng cách tính bằng km
}
