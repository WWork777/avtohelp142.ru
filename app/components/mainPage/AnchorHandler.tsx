'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnchorHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Обрабатываем якорь только на главной странице
    if (pathname === '/') {
      const hash = window.location.hash;
      if (hash) {
        const targetId = hash.substring(1);
        // Небольшая задержка для полной загрузки DOM
        setTimeout(() => {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            const headerHeight = 100;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth',
            });
          }
        }, 100);
      }
    }
  }, [pathname]);

  return null;
}

