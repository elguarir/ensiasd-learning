import { SVGAttributes } from "react";

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        strokeMiterlimit="10"
        d="M65.05 25.975c-.4 0-.8.074-1.15.224l-61 25C1.7 51.7 1 52.8 1 54s.7 2.3 1.9 2.8L21 64.2V89c0 4.3 1.8 8.3 5 11 10.5 8.9 23.9 13.3 37.4 13.3 13.6 0 27.3-4.5 38.4-13.4 3.3-2.6 5.2-6.6 5.2-10.9V64.5l18.2-7.7a3.079 3.079 0 0 0 0-5.6l-59-25a2.9 2.9 0 0 0-1.15-.225M65 32.199 116.3 54 65 75.8 11.9 54zM124 61c-1.7 0-3 1.3-3 3v18.9c0 1.7 1.3 3 3 3s3-1.4 3-3V64c0-1.7-1.3-3-3-3m-97 5.7 36.9 15.1h.1c6 2.2 11.3 4 17.1 4.3 1.6.1 2.9 1.4 2.9 3v14.3c-18.1 7.2-39.3 4.5-54.1-8-1.8-1.6-2.9-3.9-2.9-6.4z"
        fontFamily="none"
        fontSize="none"
        fontWeight="none"
        style={{ mixBlendMode: "normal" }}
        textAnchor="none"
        transform="scale(2)"
      ></path>
    </svg>
  );
}
