export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600">
          <p>© {currentYear} NewsAdmin. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Help Center
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}