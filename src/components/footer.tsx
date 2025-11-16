'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Github, Twitter } from 'lucide-react';

export function Footer(): JSX.Element {
  return (
    <Card className="border-t rounded-none bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="pt-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm font-medium text-gray-900">
                Built with ❤️ on Base
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ERC-8021 Builder Codes Platform
              </p>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://github.com/sinirlibiber"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>@sinirlibiber</span>
              </a>
              
              <a
                href="https://farcaster.xyz/gumusbey"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-purple-600 transition-colors"
              >
                <svg 
                  className="h-4 w-4" 
                  viewBox="0 0 1000 1000" 
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M257.778 155.556H742.222V844.444H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.444H257.778V155.556Z"/>
                  <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.444H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z"/>
                  <path d="M870.222 253.333L841.333 351.111H816.889V746.667C829.162 746.667 839.111 756.616 839.111 768.889V795.556H843.556C855.828 795.556 865.778 805.505 865.778 817.778V844.444H616.889V817.778C616.889 805.505 626.838 795.556 639.111 795.556H643.556V768.889C643.556 756.616 653.505 746.667 665.778 746.667H692.444V253.333H870.222Z"/>
                </svg>
                <span>@gumusbey</span>
              </a>
            </div>

            <div className="text-center md:text-right">
              <p className="text-xs text-muted-foreground">
                Powered by{' '}
                <a 
                  href="https://www.base.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Base
                </a>
                {' '}&{' '}
                <a 
                  href="https://www.coinbase.com/onchainkit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  OnchainKit
                </a>
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} ERC-8021 Builder Codes. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Learn more about{' '}
                <a 
                  href="https://eip.tools/eip/8021" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  ERC-8021 Standard
                </a>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
