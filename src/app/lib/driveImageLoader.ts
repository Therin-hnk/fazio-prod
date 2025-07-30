// myImageLoader.js
'use client' // If using in a Client Component

export default function driveImageLoader({ src }: { src: string }) {
    // Assuming 'src' is the Google Drive file ID
    return `https://drive.google.com/uc?id=${src}&export=download`;
}