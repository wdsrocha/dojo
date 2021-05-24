import { Typography } from "antd";
import NextLink from "next/link";
import { ComponentProps, PropsWithChildren } from "react";

const { Link: TypographyLink } = Typography;

type NextLinkProps = ComponentProps<typeof NextLink>;
type TypographyLinkProps = Omit<ComponentProps<typeof TypographyLink>, "href">;

interface HyperlinkProps extends NextLinkProps, TypographyLinkProps {}

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
}: PropsWithChildren<HyperlinkProps>) => (
  <NextLink href={href} passHref {...props}>
    <TypographyLink {...props}>{children}</TypographyLink>
  </NextLink>
);
