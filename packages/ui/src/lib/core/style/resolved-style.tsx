interface ResolvedStyleProps {
  className: string;
  styles: JSX.Element;
}

export function ResolvedStyle({ children }: { children: ResolvedStyleProps }) {
  return <style>{children.styles.props.children}</style>;
}
