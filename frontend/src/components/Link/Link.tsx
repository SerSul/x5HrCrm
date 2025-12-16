import { Link as RouterLink } from 'react-router';
import styles from './Link.module.scss';

interface LinkProps {
  to: string;
  variant?: 'inline' | 'nav';
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

const Link = ({
  to,
  variant = 'inline',
  children,
  className = '',
  external = false,
}: LinkProps) => {
  const linkClassName = `${styles.link} ${styles[variant]} ${className}`.trim();

  if (external) {
    return (
      <a
        href={to}
        className={linkClassName}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${children} (opens in new tab)`}
      >
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={to} className={linkClassName}>
      {children}
    </RouterLink>
  );
};

export default Link;
