import useGetBrandingColours from "@/lib/getBrandColours";
import useTheme from "@/lib/hooks/useTheme";
import { useCalcomTheme } from "@/ui";

export const useBrandColors = ({
  brandColor,
  darkBrandColor,
  theme,
}: {
  brandColor?: string;
  darkBrandColor?: string;
  theme?: string | null;
}) => {
  const brandTheme = useGetBrandingColours({
    lightVal: brandColor,
    darkVal: darkBrandColor,
  });

  useCalcomTheme(brandTheme);
  useTheme(theme);
};
