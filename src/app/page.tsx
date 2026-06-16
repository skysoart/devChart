import Navbar from "@/components/Navbar";
import Link from "next/link";
import connectDB from "@/lib/mongodb";

export default async function Home() {
  await connectDB();

  return (
    <div>
      <Navbar />
      <div className="flex flex-wrap items-center justify-center min-h-[calc(100vh-64px)] px-6 gap-8">
        <div className="max-w-lg">
          <h1 className="text-8xl md:text-9xl font-bold text-teal-200 text-outline-black leading-tight">
            devChart
          </h1>
          <p className="text-lg text-gray-600 mt-4 leading-relaxed">
            Create tasks, assign them to members, set deadlines and track progress as things get done.
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            <span className="text-sm bg-black text-teal-200 px-3 py-1 rounded-full font-medium">Drag &amp; Drop</span>
            <span className="text-sm bg-black text-teal-200 px-3 py-1 rounded-full font-medium">Member Assignment</span>
            <span className="text-sm bg-black text-teal-200 px-3 py-1 rounded-full font-medium">Due Dates</span>
            <span className="text-sm bg-black text-teal-200 px-3 py-1 rounded-full font-medium">Priority Sorting</span>
            <span className="text-sm bg-black text-teal-200 px-3 py-1 rounded-full font-medium">Inline Editing</span>
          </div>

          <div className="flex gap-3 mt-8">
            <Link href="/dashboard">
              <button className="rounded-xl py-3 px-6 bg-black text-teal-200 font-bold text-lg hover:bg-gray-800 transition-colors">
                Open Board →
              </button>
            </Link>
            <Link href="/create-task">
              <button className="rounded-xl py-3 px-6 border-2 border-black font-bold text-lg hover:bg-black hover:text-teal-200 transition-colors">
                Create Task
              </button>
            </Link>
          </div>
        </div>

        <img src="/logo.svg" alt="devChart logo" className="w-80 md:w-96 h-auto" />
      </div>
    </div>
  );
}