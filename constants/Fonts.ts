export const Fonts = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export const FontSizes = {
  small: 12,
  default: 16,
  medium: 18,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
};

export const LineHeights = {
  small: 18,
  default: 24,
  medium: 26,
  large: 30,
  xlarge: 32,
  xxlarge: 38,
};

export const TextStyles = {
  paragraph: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.default,
    lineHeight: LineHeights.default,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xxlarge,
    lineHeight: LineHeights.xxlarge,
  },
  subtitle: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.large,
    lineHeight: LineHeights.large,
  },
  button: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.default,
    lineHeight: LineHeights.default,
  },
  caption: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    lineHeight: LineHeights.small,
  },
}; 