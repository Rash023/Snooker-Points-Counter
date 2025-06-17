import { Trophy, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Snooker Counter</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-600">
            <span>© {new Date().getFullYear()} All rights reserved.</span>
            <div className="flex items-center gap-1">
              <span>Created with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by</span>
              <span className="font-medium text-green-600">Rashid Mazhar</span>
            </div>
          </div>
        </div>

       
      </div>
    </footer>
  )
}
