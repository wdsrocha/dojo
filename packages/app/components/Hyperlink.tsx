import { Typography } from "antd";
import NextLink from "next/link";
import { ComponentProps, PropsWithChildren } from "react";

const { Link: TypographyLink } = Typography;

type NextLinkProps = ComponentProps<typeof NextLink>;

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
}: PropsWithChildren<NextLinkProps>) => (
  <NextLink href={href} passHref {...props}>
    <TypographyLink>{children}</TypographyLink>
  </NextLink>
);
