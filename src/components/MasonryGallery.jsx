"use client";

import { useState } from "react";
import Image from "next/image";

export default function MasonryGallery({ images }) {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="p-4">
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((img) => (
          <div key={img.name} className="break-inside-avoid cursor-pointer relative">
            {/* Image with Text Overlay */}
            <div className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform duration-300">
              <Image
                src={img.image}
                alt={img.name}
                width={400}
                height={300}
                unoptimized
                className="object-cover w-full h-full"
                onClick={() => setLightbox(img)}
              />

              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3 text-center backdrop-blur-xl bg-opacity-10">
                <p className="text-white text-lg font-semibold">{img.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center p-4 z-50"
          onClick={() => setLightbox(null)}
        >
          <div className="relative w-[80%] h-auto max-w-4xl">
            <Image
              src={lightbox.image}
              alt={lightbox.name}
              width={800}
              height={600}
              unoptimized
              className="rounded-lg shadow-lg"
            />
          </div>
          <p className="text-white text-xl font-bold mt-4">{lightbox.name}</p>
        </div>
      )}
    </div>
  );
}
