"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircle,
  Circle,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface QuizOption {
  id?: number;
  text: string;
  is_correct: boolean;
}

interface QuizQuestion {
  id?: number;
  question: string;
  options: QuizOption[];
}

interface QuizBuilderProps {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}

export function QuizBuilder({ questions, onChange }: QuizBuilderProps) {
  const [openQuestion, setOpenQuestion] = useState<string | undefined>(
    "question-0",
  );

  const addQuestion = () => {
    const newQuestions = [
      ...questions,
      {
        question: "",
        options: [
          { text: "", is_correct: true },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ],
      },
    ];
    onChange(newQuestions);
    setOpenQuestion(`question-${newQuestions.length - 1}`);
  };

  const updateQuestion = (index: number, question: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      question,
    };
    onChange(newQuestions);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    text: string,
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = {
      ...newQuestions[questionIndex].options[optionIndex],
      text,
    };
    onChange(newQuestions);
  };

  const setCorrectOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];

    // Set all options to false first
    newQuestions[questionIndex].options = newQuestions[
      questionIndex
    ].options.map((option) => ({
      ...option,
      is_correct: false,
    }));

    // Then set the selected option to true
    newQuestions[questionIndex].options[optionIndex].is_correct = true;

    onChange(newQuestions);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({
      text: "",
      is_correct: false,
    });
    onChange(newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];

    // Don't remove if it's the only option or if it's the correct option
    if (newQuestions[questionIndex].options.length <= 1) {
      return;
    }

    // Check if removing the correct option
    const isRemovingCorrect =
      newQuestions[questionIndex].options[optionIndex].is_correct;

    // Remove the option
    newQuestions[questionIndex].options.splice(optionIndex, 1);

    // If we removed the correct option, set the first option as correct
    if (isRemovingCorrect && newQuestions[questionIndex].options.length > 0) {
      newQuestions[questionIndex].options[0].is_correct = true;
    }

    onChange(newQuestions);
  };

  const removeQuestion = (questionIndex: number) => {
    // Don't remove if it's the only question
    if (questions.length <= 1) {
      return;
    }

    const newQuestions = [...questions];
    newQuestions.splice(questionIndex, 1);
    onChange(newQuestions);

    // Update open question if needed
    if (openQuestion === `question-${questionIndex}`) {
      setOpenQuestion(newQuestions.length > 0 ? `question-0` : undefined);
    }
  };

  const moveQuestion = (questionIndex: number, direction: "up" | "down") => {
    if (
      (direction === "up" && questionIndex === 0) ||
      (direction === "down" && questionIndex === questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...questions];
    const targetIndex =
      direction === "up" ? questionIndex - 1 : questionIndex + 1;

    // Swap the questions
    [newQuestions[questionIndex], newQuestions[targetIndex]] = [
      newQuestions[targetIndex],
      newQuestions[questionIndex],
    ];

    onChange(newQuestions);

    // Update open question
    setOpenQuestion(`question-${targetIndex}`);
  };

  return (
    <div className="space-y-4">
      <Accordion
        type="single"
        collapsible
        value={openQuestion}
        onValueChange={setOpenQuestion}
        className="space-y-4"
      >
        {questions.map((question, questionIndex) => (
          <AccordionItem
            key={questionIndex}
            value={`question-${questionIndex}`}
            className="overflow-hidden rounded-md border border-b!"
          >
            <div className="bg-muted/30 flex items-center">
              <div className="relative flex-grow">
                <AccordionTrigger className="hover:bg-muted/50 px-4 py-2 hover:no-underline">
                  <span className="line-clamp-1 truncate text-sm font-medium">
                    {question.question
                      ? question.question.substring(0, 50)
                      : `Question ${questionIndex + 1}`}
                  </span>
                </AccordionTrigger>
              </div>

              {/* Action buttons positioned absolutely to avoid interfering with trigger click area */}
              <div className="flex items-center gap-1 px-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveQuestion(questionIndex, "up");
                      }}
                      disabled={questionIndex === 0}
                      className="h-8 w-8"
                    >
                      <ArrowUpIcon className="h-4 w-4" />
                      <span className="sr-only">Move up</span>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Move question up</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveQuestion(questionIndex, "down");
                      }}
                      disabled={questionIndex === questions.length - 1}
                      className="h-8 w-8"
                    >
                      <ArrowDownIcon className="h-4 w-4" />
                      <span className="sr-only">Move down</span>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Move question down</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeQuestion(questionIndex);
                      }}
                      disabled={questions.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove question</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    arrowClassName="bg-destructive fill-destructive"
                    className="text-destructive-foreground bg-destructive"
                  >
                    Remove question
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <AccordionContent className="px-4 pt-2 pb-4">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor={`question-${questionIndex}`}
                    className="text-sm font-medium"
                  >
                    Question
                  </label>
                  <Textarea
                    id={`question-${questionIndex}`}
                    placeholder="Enter your question"
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(questionIndex, e.target.value)
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Options (select the correct answer)
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(questionIndex)}
                      className="h-7 text-xs"
                    >
                      <PlusCircle className="h-3 w-3" />
                      Add Option
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center gap-2"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setCorrectOption(questionIndex, optionIndex)
                          }
                          className="flex-shrink-0"
                        >
                          {option.is_correct ? (
                            <CheckCircle className="text-primary h-5 w-5" />
                          ) : (
                            <Circle className="text-muted-foreground h-5 w-5" />
                          )}
                          <span className="sr-only">
                            {option.is_correct
                              ? "Correct answer"
                              : "Mark as correct"}
                          </span>
                        </button>

                        <Input
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option.text}
                          onChange={(e) =>
                            updateOption(
                              questionIndex,
                              optionIndex,
                              e.target.value,
                            )
                          }
                          className={cn(
                            "flex-1",
                            option.is_correct && "border-primary",
                          )}
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeOption(questionIndex, optionIndex)
                          }
                          disabled={question.options.length <= 1}
                          className="text-destructive/70 hover:text-destructive h-8 w-8 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove option</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button
        type="button"
        variant="outline"
        onClick={addQuestion}
        className="w-full"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Question
      </Button>
    </div>
  );
}
