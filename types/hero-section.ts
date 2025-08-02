import { StaticImageData } from "next/image";

export type Slide = {
  className: string;
  imageSrc: string | StaticImageData;
  bgColor?: string;
};
