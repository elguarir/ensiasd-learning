const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, "$1")
    .replace(/\.0$/, "");
const rem = (px) => `${round(px / 16)}rem`;
const em = (px, base) => `${round(px / base)}em`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      typography: {
        xs: {
          css: [
            {
              fontSize: rem(12),
              lineHeight: round(20 / 12),
              p: {
                marginTop: em(12, 12),
                marginBottom: em(12, 12),
              },
              '[class~="lead"]': {
                fontSize: em(16, 12),
                lineHeight: round(24 / 16),
                marginTop: em(12, 16),
                marginBottom: em(12, 16),
              },
              blockquote: {
                marginTop: em(20, 16),
                marginBottom: em(20, 16),
                paddingInlineStart: em(18, 16),
              },
              h1: {
                fontSize: em(24, 12),
                marginTop: "0",
                marginBottom: em(20, 24),
                lineHeight: round(30 / 24),
              },
              h2: {
                fontSize: em(18, 12),
                marginTop: em(28, 18),
                marginBottom: em(12, 18),
                lineHeight: round(24 / 18),
              },
              h3: {
                fontSize: em(16, 12),
                marginTop: em(24, 16),
                marginBottom: em(6, 16),
                lineHeight: round(24 / 16),
              },
              h4: {
                marginTop: em(16, 12),
                marginBottom: em(6, 12),
                lineHeight: round(18 / 12),
              },
              img: {
                marginTop: em(20, 12),
                marginBottom: em(20, 12),
              },
              picture: {
                marginTop: em(20, 12),
                marginBottom: em(20, 12),
              },
              "picture > img": {
                marginTop: "0",
                marginBottom: "0",
              },
              video: {
                marginTop: em(20, 12),
                marginBottom: em(20, 12),
              },
              kbd: {
                fontSize: em(10, 12),
                borderRadius: rem(4),
                paddingTop: em(1.5, 12),
                paddingInlineEnd: em(4, 12),
                paddingBottom: em(1.5, 12),
                paddingInlineStart: em(4, 12),
              },
              code: {
                fontSize: em(10, 12),
              },
              "h2 code": {
                fontSize: em(16, 18),
              },
              "h3 code": {
                fontSize: em(14, 16),
              },
              pre: {
                fontSize: em(10, 12),
                lineHeight: round(18 / 10),
                marginTop: em(18, 10),
                marginBottom: em(18, 10),
                borderRadius: rem(3),
                paddingTop: em(6, 10),
                paddingInlineEnd: em(10, 10),
                paddingBottom: em(6, 10),
                paddingInlineStart: em(10, 10),
              },
              ol: {
                marginTop: em(12, 12),
                marginBottom: em(12, 12),
                paddingInlineStart: em(20, 12),
              },
              ul: {
                marginTop: em(12, 12),
                marginBottom: em(12, 12),
                paddingInlineStart: em(20, 12),
              },
              li: {
                marginTop: em(3, 12),
                marginBottom: em(3, 12),
              },
              "ol > li": {
                paddingInlineStart: em(5, 12),
              },
              "ul > li": {
                paddingInlineStart: em(5, 12),
              },
              "> ul > li p": {
                marginTop: em(6, 12),
                marginBottom: em(6, 12),
              },
              "> ul > li > p:first-child": {
                marginTop: em(12, 12),
              },
              "> ul > li > p:last-child": {
                marginBottom: em(12, 12),
              },
              "> ol > li > p:first-child": {
                marginTop: em(12, 12),
              },
              "> ol > li > p:last-child": {
                marginBottom: em(12, 12),
              },
              "ul ul, ul ol, ol ul, ol ol": {
                marginTop: em(6, 12),
                marginBottom: em(6, 12),
              },
              dl: {
                marginTop: em(12, 12),
                marginBottom: em(12, 12),
              },
              dt: {
                marginTop: em(12, 12),
              },
              dd: {
                marginTop: em(3, 12),
                paddingInlineStart: em(20, 12),
              },
              hr: {
                marginTop: em(32, 12),
                marginBottom: em(32, 12),
              },
              "hr + *": {
                marginTop: "0",
              },
              "h2 + *": {
                marginTop: "0",
              },
              "h3 + *": {
                marginTop: "0",
              },
              "h4 + *": {
                marginTop: "0",
              },
              table: {
                fontSize: em(10, 12),
                lineHeight: round(16 / 10),
              },
              "thead th": {
                paddingInlineEnd: em(10, 10),
                paddingBottom: em(6, 10),
                paddingInlineStart: em(10, 10),
              },
              "thead th:first-child": {
                paddingInlineStart: "0",
              },
              "thead th:last-child": {
                paddingInlineEnd: "0",
              },
              "tbody td, tfoot td": {
                paddingTop: em(6, 10),
                paddingInlineEnd: em(10, 10),
                paddingBottom: em(6, 10),
                paddingInlineStart: em(10, 10),
              },
              "tbody td:first-child, tfoot td:first-child": {
                paddingInlineStart: "0",
              },
              "tbody td:last-child, tfoot td:last-child": {
                paddingInlineEnd: "0",
              },
              figure: {
                marginTop: em(20, 12),
                marginBottom: em(20, 12),
              },
              "figure > *": {
                marginTop: "0",
                marginBottom: "0",
              },
              figcaption: {
                fontSize: em(10, 12),
                lineHeight: round(14 / 10),
                marginTop: em(6, 10),
              },
            },
            {
              "> :first-child": {
                marginTop: "0",
              },
              "> :last-child": {
                marginBottom: "0",
              },
            },
          ],
        },
      },
    },
  },
};
