
import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                JiranRide
              </span>
            </Link>
            <p className="text-gray-600 text-sm mb-6 max-w-xs">
              Building communities and reducing traffic through shared rides across Malaysia.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Facebook">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Instagram">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Twitter">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="YouTube">
                <YoutubeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 text-sm hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 text-sm hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 text-sm hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-gray-600 text-sm hover:text-primary transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-sm font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-gray-600 text-sm hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-gray-600 text-sm hover:text-primary transition-colors">
                  Safety
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 text-sm hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-600 text-sm hover:text-primary transition-colors">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-gray-600 text-sm hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 text-sm hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 text-sm hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/licenses" className="text-gray-600 text-sm hover:text-primary transition-colors">
                  Licenses
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-sm font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-600 text-sm mb-4">
              Stay updated with the latest news and offers
            </p>
            <div className="flex flex-col space-y-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white border-gray-200 focus:border-primary focus:ring-primary"
              />
              <Button size="sm" className="w-full">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} JiranRide. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Flag_of_Malaysia.svg/800px-Flag_of_Malaysia.svg.png" 
                alt="Malaysian Flag" 
                className="w-4 h-auto mr-1"
              />
              <span className="text-xs text-gray-500">Malaysia</span>
            </div>
            <select 
              className="text-xs text-gray-500 bg-transparent border-none focus:ring-0 py-0" 
              defaultValue="en"
            >
              <option value="en">English</option>
              <option value="ms">Bahasa Malaysia</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
