// AlignUI Avatar v0.0.0

import {Slot} from '@radix-ui/react-slot';
import * as React from 'react';
import Image from 'next/image';

import {
  IconEmptyCompany,
  IconEmptyUser
} from '@/components/align-ui/ui/avatar-empty-icons';
import {cn} from '@/utils/cn';
import {recursiveCloneChildren} from '@/utils/recursive-clone-children';
import {tv, type VariantProps} from '@/utils/tv';

export const AVATAR_ROOT_NAME = 'AvatarRoot';
const AVATAR_IMAGE_NAME = 'AvatarImage';
const AVATAR_INDICATOR_NAME = 'AvatarIndicator';
const AVATAR_STATUS_NAME = 'AvatarStatus';
const AVATAR_BRAND_LOGO_NAME = 'AvatarBrandLogo';
const AVATAR_NOTIFICATION_NAME = 'AvatarNotification';
const AVATAR_FALLBACK_NAME = 'AvatarFallback';

export const avatarVariants = tv({
  slots: {
    root: [
      'relative flex shrink-0 items-center justify-center rounded-full',
      'select-none text-center uppercase'
    ],
    image: 'size-full rounded-full object-cover',
    indicator:
      'absolute flex size-8 items-center justify-center drop-shadow-[0_2px_4px_#1b1c1d0a]'
  },
  variants: {
    size: {
      '80': {
        root: 'size-20 text-title-h5'
      },
      '72': {
        root: 'size-[72px] text-title-h5'
      },
      '64': {
        root: 'size-16 text-title-h5'
      },
      '56': {
        root: 'size-14 text-label-lg'
      },
      '48': {
        root: 'size-12 text-label-lg'
      },
      '40': {
        root: 'size-10 text-label-md'
      },
      '32': {
        root: 'size-8 text-label-sm'
      },
      '24': {
        root: 'size-6 text-label-xs'
      },
      '20': {
        root: 'size-5 text-label-xs'
      }
    },
    color: {
      gray: {
        root: 'bg-bg-soft-200 text-static-black'
      },
      yellow: {
        root: 'bg-yellow-200 text-yellow-950'
      },
      blue: {
        root: 'bg-blue-200 text-blue-950'
      },
      sky: {
        root: 'bg-sky-200 text-sky-950'
      },
      purple: {
        root: 'bg-purple-200 text-purple-950'
      },
      red: {
        root: 'bg-red-200 text-red-950'
      }
    }
  },
  compoundVariants: [
    {
      size: ['80', '72'],
      class: {
        indicator: '-right-2'
      }
    },
    {
      size: '64',
      class: {
        indicator: '-right-2 scale-[.875]'
      }
    },
    {
      size: '56',
      class: {
        indicator: '-right-1.5 scale-75'
      }
    },
    {
      size: '48',
      class: {
        indicator: '-right-1.5 scale-[.625]'
      }
    },
    {
      size: '40',
      class: {
        indicator: '-right-1.5 scale-[.5625]'
      }
    },
    {
      size: '32',
      class: {
        indicator: '-right-1.5 scale-50'
      }
    },
    {
      size: '24',
      class: {
        indicator: '-right-1 scale-[.375]'
      }
    },
    {
      size: '20',
      class: {
        indicator: '-right-1 scale-[.3125]'
      }
    }
  ],
  defaultVariants: {
    size: '80',
    color: 'gray'
  }
});

type AvatarSharedProps = VariantProps<typeof avatarVariants>;

export type AvatarRootProps = VariantProps<typeof avatarVariants> &
  React.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
    placeholderType?: 'user' | 'company';
    fallbackText?: string;
  };

const AvatarRoot = React.forwardRef<HTMLDivElement, AvatarRootProps>(
  (
    {
      asChild,
      children,
      size,
      color,
      className,
      placeholderType = 'user',
      fallbackText,
      ...rest
    },
    forwardedRef
  ) => {
    const uniqueId = React.useId();
    const Component = asChild ? Slot : 'div';
    const {root} = avatarVariants({size, color});

    const sharedProps: AvatarSharedProps = {
      size,
      color
    };

    // use placeholder icon if no children provided
    if (!children) {
      return (
        <div className={root({class: className})} {...rest}>
          <AvatarImage asChild>
            {placeholderType === 'company' ? (
              <IconEmptyCompany />
            ) : (
              <IconEmptyUser />
            )}
          </AvatarImage>
        </div>
      );
    }

    // Process children to handle fallback text
    const processedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === AvatarImage) {
        // Type assertion to access props safely
        const childProps = child.props as {src?: string};

        // If we have an image and it has a src, use it
        if (childProps.src) {
          return child;
        }

        // If we have fallback text, create a fallback component
        if (fallbackText) {
          // Get initials (max 2 letters)
          const initials = fallbackText
            .split(' ')
            .map((name) => name.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);

          return (
            <div className={root({class: `${className} text-text-strong-950`})}>
              {initials}
            </div>
          );
        }
      }
      return child;
    });

    const extendedChildren = recursiveCloneChildren(
      processedChildren as React.ReactElement[],
      sharedProps,
      [AVATAR_IMAGE_NAME, AVATAR_INDICATOR_NAME],
      uniqueId,
      asChild
    );

    return (
      <Component
        ref={forwardedRef}
        className={root({class: className})}
        {...rest}
      >
        {extendedChildren}
      </Component>
    );
  }
);
AvatarRoot.displayName = AVATAR_ROOT_NAME;

type AvatarImageProps = AvatarSharedProps &
  Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'color' | 'src'> & {
    asChild?: boolean;
    useNextImage?: boolean;
    src?: string;
  };

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  (
    {
      asChild,
      className,
      size,
      color,
      useNextImage = true,
      src,
      alt = '',
      ...rest
    },
    forwardedRef
  ) => {
    const {image} = avatarVariants({size, color});

    // Get size from the avatarVariants
    const sizeMap = {
      '80': 80,
      '72': 72,
      '64': 64,
      '56': 56,
      '48': 48,
      '40': 40,
      '32': 32,
      '24': 24,
      '20': 20
    };

    const sizeValue = sizeMap[size as keyof typeof sizeMap] || 80;

    const restProps = rest;

    // If using asChild, let the parent component handle the rendering
    if (asChild) {
      return (
        <Slot
          ref={forwardedRef}
          className={image({class: className})}
          {...rest}
        />
      );
    }

    // If using Next.js Image
    if (useNextImage) {
      // Ensure src is not undefined for Next.js Image
      if (!src) {
        return null;
      }

      const {width, height, ...rest} = restProps;

      return (
        <Image
          ref={forwardedRef}
          className={image({class: className})}
          width={sizeValue}
          height={sizeValue}
          src={src}
          alt={alt}
          {...rest}
        />
      );
    }

    // For regular img element
    return (
      <img
        ref={forwardedRef}
        className={image({class: className})}
        src={src}
        alt={alt}
        {...rest}
      />
    );
  }
);
AvatarImage.displayName = AVATAR_IMAGE_NAME;

function AvatarIndicator({
  size,
  color,
  className,
  position = 'bottom',
  ...rest
}: AvatarSharedProps &
  React.HTMLAttributes<HTMLDivElement> & {
    position?: 'top' | 'bottom';
  }) {
  const {indicator} = avatarVariants({size, color});

  return (
    <div
      className={cn(indicator({class: className}), {
        'top-0 origin-top-right': position === 'top',
        'bottom-0 origin-bottom-right': position === 'bottom'
      })}
      {...rest}
    />
  );
}
AvatarIndicator.displayName = AVATAR_INDICATOR_NAME;

export const avatarStatusVariants = tv({
  base: 'box-content size-3 rounded-full border-4 border-bg-white-0',
  variants: {
    status: {
      online: 'bg-success-base',
      offline: 'bg-faded-base',
      busy: 'bg-error-base',
      away: 'bg-away-base'
    }
  },
  defaultVariants: {
    status: 'online'
  }
});

function AvatarStatus({
  status,
  className,
  ...rest
}: VariantProps<typeof avatarStatusVariants> &
  React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={avatarStatusVariants({status, class: className})}
      {...rest}
    />
  );
}
AvatarStatus.displayName = AVATAR_STATUS_NAME;

type AvatarBrandLogoProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  asChild?: boolean;
};

const AvatarBrandLogo = React.forwardRef<
  HTMLImageElement,
  AvatarBrandLogoProps
>(({asChild, className, ...rest}, forwardedRef) => {
  const Component = asChild ? Slot : 'img';

  return (
    <Component
      ref={forwardedRef}
      className={cn(
        'box-content size-6 rounded-full border-2 border-bg-white-0',
        className
      )}
      {...rest}
    />
  );
});
AvatarBrandLogo.displayName = AVATAR_BRAND_LOGO_NAME;

function AvatarNotification({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'box-content size-3 rounded-full border-2 border-bg-white-0 bg-error-base',
        className
      )}
      {...rest}
    />
  );
}
AvatarNotification.displayName = AVATAR_NOTIFICATION_NAME;

export {
  AvatarBrandLogo as BrandLogo,
  AvatarImage as Image,
  AvatarIndicator as Indicator,
  AvatarNotification as Notification,
  AvatarRoot as Root,
  AvatarStatus as Status
};
