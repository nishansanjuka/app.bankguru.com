import Link from "next/link";
import Image from "next/image";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin 
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#4B4B4B] text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo/logo.png"
                alt="BankGuru Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-xl font-bold">BankGuru</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Sri Lanka&apos;s leading financial comparison platform helping you make smarter financial decisions with real-time data and unbiased analysis.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/credit-cards" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Credit Cards
                </Link>
              </li>
              <li>
                <Link href="/personal-loans" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Personal Loans
                </Link>
              </li>
              <li>
                <Link href="/mortgages" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Mortgages
                </Link>
              </li>
              <li>
                <Link href="/savings-accounts" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Savings Accounts
                </Link>
              </li>
              <li>
                <Link href="/insurance" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Insurance
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-orange-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-orange-500 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-600 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-orange-500" />
              <span className="text-gray-300">+94 11 234 5678</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-orange-500" />
              <span className="text-gray-300">support@bankguru.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="text-gray-300">Colombo, Sri Lanka</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2024 BankGuru. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Made with ❤️ for smarter financial decisions
          </p>
        </div>
      </div>
    </footer>
  );
}
