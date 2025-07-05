import { 
  RiInstagramLine,
  RiLinkedinFill,
  RiTwitterXLine,
  RiFacebookFill,
  RiGlobalLine,
  type RemixiconComponentType,
} from '@remixicon/react';
import Link from 'next/link';

type SocialLinks = {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  website?: string;
}

type SocialIcon = {
  icon: RemixiconComponentType;
  href: string;
  key: string;
}

export default function SocialIcons({ socialLinks }: { socialLinks: SocialLinks }) {
  const iconMap = {
    instagram: RiInstagramLine,
    linkedin: RiLinkedinFill,
    twitter: RiTwitterXLine,
    facebook: RiFacebookFill,
    website: RiGlobalLine,
  };

  const getSocialIcons = (): SocialIcon[] => {
    return Object.entries(socialLinks)
      .filter(([_, link]) => link)
      .map(([key, href]) => ({
        icon: iconMap[key as keyof typeof iconMap],
        href: href!,
        key
      }));
  };

  const socialIcons = getSocialIcons();

  return (
    <div className='flex flex-row gap-2'>
      {
        socialIcons.map(({ icon: Icon, href, key }) => (
          <Link 
            key={key}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className="text-text-sub-600 hover:text-text-strong-950 transition-colors"
          >
            <Icon size={25} />
          </Link>
      ))}
    </div>
  );
}

