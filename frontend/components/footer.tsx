import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#151229] border-t border-purple-800/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-white">ContentDAO</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Decentralized content payment platform that gives quality content its deserved value and allows creators to earn directly from fans.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-purple-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-purple-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/tokenomics" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Tokenomics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Developer Docs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-800/30 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2024 ContentDAO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
