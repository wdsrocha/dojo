import { Typography } from "antd";
import NextLink from "next/link";
import { ComponentProps, PropsWithChildren } from "react";

const { Link: TypographyLink } = Typography;

type NextLinkProps = Omit<ComponentProps<typeof NextLink>, "href">;
type TypographyLinkProps = Omit<ComponentProps<typeof TypographyLink>, "href">;

interface TextLinkProps extends NextLinkProps, TypographyLinkProps {
  href: string;
}

/**
 * Next.js Link functionalities + Ant Design Link visuals
 *
 * @example
 * ```jsx
 * <Hyperlink href="/">
 *   Back to home
 * </Hyperlink>
 * ```
 */
export const Hyperlink = ({
  children,
  href,
  ...props
}: PropsWithChildren<TextLinkProps>) => (
  <NextLink href={href} {...props}>
    <TypographyLink href={href} {...props}>
      {children}
    </TypographyLink>
  </NextLink>
);
