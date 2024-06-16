"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function QuizDetail() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState<any>(0);
  const [showResults, setShowResults] = useState<any>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);

  useEffect(() => {
    if (id) {
      const fetchQuizDetails = async () => {
        const { data: quizData, error: quizError } = await supabase
          .from("quizzes")
          .select("*")
          .eq("id", id)
          .single();

        const { data: questionsData, error: questionsError } = await supabase
          .from("questions")
          .select(
            `
            *,
            options (*)
          `
          )
          .eq("quiz_id", id);

        if (quizError || questionsError) {
          console.error(
            "Error fetching quiz details:",
            quizError || questionsError
          );
        } else {
          setQuiz(quizData);
          setQuestions(questionsData);
        }
      };

      fetchQuizDetails();
    }
  }, [id]);

  const handleAnswerClick = (isCorrect: boolean, optionId: number) => {
    console.log(`Answer clicked: ${optionId}, Correct: ${isCorrect}`);
    setSelectedOption(optionId);
    setIsCorrectAnswer(isCorrect);
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < questions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
      } else {
        setShowResults(true);
      }
      setSelectedOption(null);
      setIsCorrectAnswer(null);
    }, 4000);
  };

  if (!quiz) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      {showResults ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Quiz Results</h2>
          <p className="text-lg mb-4 text-center">
            You scored {score} out of {questions.length}
          </p>
          <Button
            onClick={() => {
              setCurrentQuestionIndex(0);
              setScore(0);
              setShowResults(false);
            }}
            className="w-full"
            variant="outline"
          >
            Play Again
          </Button>
          <Link href="/quiz-list">
            <Button className="w-full mt-2">Go Back</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <p className="text-lg mb-4">
            {questions[currentQuestionIndex].question_text}
          </p>
          <div className="grid gap-4">
            {questions[currentQuestionIndex].options.map((option: any) => (
              <Button
                key={option.id}
                onClick={() => handleAnswerClick(option.is_correct, option.id)}
                variant="outline"
                className={`justify-start transition-colors duration-200 ${
                  selectedOption !== null
                    ? selectedOption === option.id
                      ? isCorrectAnswer
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                      : option.is_correct
                      ? "bg-green-600 text-white"
                      : "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={selectedOption !== null}
              >
                {option.option_text}
              </Button>
            ))}
          </div>
          {selectedOption !== null && (
            <div className="mt-4 text-center">
              <p className={`text-lg ${isCorrectAnswer ? "text-green-700" : "text-red-600"}`}>
                {isCorrectAnswer ? "Correct!" : "Incorrect!"}
              </p>
              {!isCorrectAnswer && (
                <p className="text-lg text-green-600">
                  The correct answer is: {questions[currentQuestionIndex].options.find((option: any) => option.is_correct).option_text}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
