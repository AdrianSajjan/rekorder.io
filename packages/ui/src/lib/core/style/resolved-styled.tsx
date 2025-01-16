interface ResolvedStyledProps {
  className: string;
  styles: JSX.Element;
}

export function ResolvedStyled(props: ResolvedStyledProps) {
  return <style>{props.styles.props.children}</style>;
}
