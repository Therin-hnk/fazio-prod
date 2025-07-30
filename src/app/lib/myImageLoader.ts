// myImageLoader.ts
export default function driveImageLoader({ src }: { src: string }) {
  return `https://drive.google.com/uc?id=${src}&export=view`;
}
