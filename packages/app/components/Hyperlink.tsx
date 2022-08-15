import Link from "next/link";
import { ComponentProps, PropsWithChildren } from "react";

type Props = PropsWithChildren<ComponentProps<typeof Link>>;

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
export const Hyperlink = ({ children, href, ...props }: Props) => (
  <Link href={href} passHref {...props}>
    <a className="text-link">{children}</a>
  </Link>
);
