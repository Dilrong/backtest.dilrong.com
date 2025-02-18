export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50 bg-black/40 backdrop-blur-lg shadow-lg rounded-b-xl">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          🚀
        </h1>
        <nav className="flex space-x-6"></nav>
      </div>
    </header>
  );
}
