export function Table({ children }: { children: React.ReactNode }) {
  return (
    <table className="w-full border-collapse border border-gray-700">
      {children}
    </table>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-800 text-white">{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="text-gray-300">{children}</tbody>;
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="border-b border-gray-700 hover:bg-gray-800">{children}</tr>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <th className="p-3 text-left font-semibold">{children}</th>;
}

export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="p-3 border border-gray-700">{children}</td>;
}
