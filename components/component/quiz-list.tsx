"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ListOrderedIcon, Menu, ViewIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Quiz {
  id: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export default function QuizLists() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "difficulty">("title");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchQuizzes = async () => {
      const { data, error } = await supabase.from("quizzes").select("*");
      if (error) console.error("Error fetching quizzes:", error);
      else setQuizzes(data as Quiz[]);
    };
    fetchQuizzes();
  }, []);

  const filteredQuizzes = useMemo(() => {
    let filtered = quizzes.filter((quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "title") {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered = filtered.sort((a, b) =>
        a.difficulty.localeCompare(b.difficulty)
      );
    }

    return filtered;
  }, [quizzes, searchTerm, sortBy]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <h1 className="text-3xl font-bold">Quizier</h1>
        </Link>
        <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Menu className="w-8 h-8 font-bold" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="py-4 mx-4 flex items-center gap-4">
              <Input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-40 md:w-auto px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ListOrderedIcon className="w-5 h-5" />
                    Sort by {sortBy === "title" ? "Title" : "Difficulty"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem onClick={() => setSortBy("title")}>
                    Title
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("difficulty")}>
                    Difficulty
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ListOrderedIcon className="w-5 h-5" />
                Sort by {sortBy === "title" ? "Title" : "Difficulty"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={() => setSortBy("title")}>
                Title
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("difficulty")}>
                Difficulty
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-1"
        }`}
      >
        {filteredQuizzes.map((quiz) => (
          <Card
            key={quiz.id}
            className="shadow-md mt-4 md:mt-12 rounded-lg overflow-hidden"
          >
            <CardHeader className="bg-gray-50 dark:bg-gray-800 p-4">
              <CardTitle className="text-lg font-bold">{quiz.title}</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                {quiz.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    quiz.difficulty === "Easy"
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                      : quiz.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                      : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {quiz.difficulty}
                </div>
                <Link href={`quiz/${quiz.id}`}>
                  <Button variant="outline" size="sm">
                    Start Quiz
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
