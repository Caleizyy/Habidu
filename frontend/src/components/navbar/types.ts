export interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

export interface NavbarProps {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
}
export interface SignInProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  auth?: {
    signin: {
      title: string;
      url: string;
    };
  };
}
