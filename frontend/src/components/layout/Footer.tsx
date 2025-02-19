import { Card } from "@/components/ui/card";

export default function Footer() {
  return (
    <Card className="w-full py-4 text-gray-400 text-sm flex flex-col gap-2 justify-center items-center shadow-inner rounded-t-xl bg-black/20 backdrop-blur-lg">
      <span>© 2025 Dilrong. All rights reserved.</span>
      <div>
        <a
          href="https://github.com/Dilrong"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 text-blue-400 hover:text-blue-500 transition-colors"
        >
          Github
        </a>
        <a
          href="https://twitter.com/dilrong_"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 text-blue-400 hover:text-blue-500 transition-colors"
        >
          Twitter
        </a>
      </div>
    </Card>
  );
}
