/**
 * Typography scale aligned with the BusTrackNow design system.
 * Uses Google Sans Flex font family loaded in app/_layout.jsx.
 */

const FONT = {
  regular: "GoogleSansFlex-Regular",
  medium: "GoogleSansFlex-Medium",
  semiBold: "GoogleSansFlex-SemiBold",
  bold: "GoogleSansFlex-Bold",
  extraBold: "GoogleSansFlex-ExtraBold",
};

export const typography = {
  h1: {
    fontSize: 28,
    fontFamily: FONT.extraBold,
    lineHeight: 34,
  },
  h2: {
    fontSize: 22,
    fontFamily: FONT.bold,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontFamily: FONT.bold,
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontFamily: FONT.regular,
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 15,
    fontFamily: FONT.semiBold,
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    fontFamily: FONT.regular,
    lineHeight: 16,
  },
  captionBold: {
    fontSize: 12,
    fontFamily: FONT.semiBold,
    lineHeight: 16,
  },
  button: {
    fontSize: 15,
    fontFamily: FONT.bold,
    lineHeight: 20,
  },
  label: {
    fontSize: 13,
    fontFamily: FONT.semiBold,
    lineHeight: 18,
  },
  small: {
    fontSize: 11,
    fontFamily: FONT.regular,
    lineHeight: 14,
  },
};
