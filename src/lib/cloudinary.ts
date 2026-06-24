export function clImg(url: string, transforms: string): string {
  if (!url.includes('res.cloudinary.com')) return url
  return url.replace('/image/upload/', `/image/upload/${transforms}/`)
}

export function clSrcSet(url: string, widths: number[], quality = 'auto'): string {
  if (!url.includes('res.cloudinary.com')) return ''
  return widths.map(w => `${clImg(url, `w_${w},f_auto,q_${quality}`)} ${w}w`).join(', ')
}
