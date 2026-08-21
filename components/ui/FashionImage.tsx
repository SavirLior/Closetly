import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
};

export function FashionImage({ src, alt, priority = false, width = 900, height = 1200, sizes = "(max-width: 820px) 50vw, 25vw" }: Props) {
  const unoptimized = src.startsWith("blob:") || src.startsWith("data:");
  return <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} unoptimized={unoptimized} />;
}
