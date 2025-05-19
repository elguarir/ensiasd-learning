import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Resource } from "@/types";
import { Check, PenBox, X } from "lucide-react";
import { useState } from "react";

interface QuizDetailsDialogProps {
  resource: Resource;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuizDetailsDialog({
  resource,
  open,
  onOpenChange,
}: QuizDetailsDialogProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{
    [questionId: number]: number;
  }>({});
  const [showResults, setShowResults] = useState(false);

  // Get questions from resource metadata
  const questions =
    resource.resource_type === "quiz" && resource.metadata?.questions?.length
      ? resource.metadata.questions
      : [];

  // Get total points from metadata or calculate from questions
  const totalPoints =
    resource.resource_type === "quiz" && resource.metadata?.total_points
      ? resource.metadata.total_points
      : questions.length;

  // Points per question
  const pointsPerQuestion =
    questions.length > 0 ? totalPoints / questions.length : 0;

  // Ensure we have a valid currentQuestion
  const currentQuestion =
    questions.length > 0 ? questions[currentQuestionIndex] : null;

  const handleOptionChange = (questionId: number, optionIndex: number) => {
    if (isNaN(optionIndex)) return;

    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptions({});
    setShowResults(false);
  };

  const calculateScore = () => {
    let correctCount = 0;

    questions.forEach((question) => {
      const selectedOptionIndex = selectedOptions[question.id];

      if (
        selectedOptionIndex !== undefined &&
        question.options[selectedOptionIndex]?.is_correct
      ) {
        correctCount += 1;
      }
    });

    const score = correctCount * pointsPerQuestion;

    return {
      score,
      totalPoints,
      percentage: totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0,
    };
  };

  const score = calculateScore();

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  // If no questions are available, show a message instead
  if (questions.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <PenBox className="mr-1 h-3.5 w-3.5" />
            Take Quiz
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{resource.title}</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <p>No quiz questions available for this resource.</p>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PenBox className="mr-1 h-3.5 w-3.5" />
          Take Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{resource.title}</DialogTitle>
        </DialogHeader>

        {!showResults && currentQuestion ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-muted-foreground text-sm">
                {pointsPerQuestion} {pointsPerQuestion === 1 ? "point" : "points"}
              </span>
            </div>

            <Progress
              value={((currentQuestionIndex + 1) / questions.length) * 100}
              className="h-2"
            />

            <div className="py-2">
              <h3 className="mb-4 text-lg font-medium">
                {currentQuestion.question}
              </h3>

              {currentQuestion.options && currentQuestion.options.length > 0 ? (
                <RadioGroup
                  value={selectedOptions[currentQuestion.id]?.toString() || ""}
                  onValueChange={(value) =>
                    handleOptionChange(currentQuestion.id, parseInt(value))
                  }
                  className="gap-0 -space-y-px rounded-md shadow-xs"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex flex-col gap-4 border p-4 outline-none first:rounded-t-md last:rounded-b-md has-data-[state=checked]:z-10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem
                            id={`option-${currentQuestion.id}-${index}`}
                            value={index.toString()}
                            className="after:absolute after:inset-0"
                          />
                          <Label
                            className="inline-flex items-start"
                            htmlFor={`option-${currentQuestion.id}-${index}`}
                          >
                            {option.text}
                          </Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <p className="text-muted-foreground py-4 text-center">
                  No options available for this question.
                </p>
              )}
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                disabled={
                  !currentQuestion.options ||
                  selectedOptions[currentQuestion.id] === undefined
                }
              >
                {currentQuestionIndex < questions.length - 1
                  ? "Next"
                  : "Finish Quiz"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="mb-2 text-xl font-medium">Quiz Results</h3>
              <div className="mb-2 text-3xl font-bold">{score.percentage}%</div>
              <p className="text-muted-foreground">
                You scored {score.score.toFixed(1)} out of {score.totalPoints}{" "}
                points
              </p>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => {
                const selectedOptionIndex = selectedOptions[question.id];
                const selectedOption =
                  selectedOptionIndex !== undefined
                    ? question.options[selectedOptionIndex]
                    : undefined;
                const isCorrect = selectedOption?.is_correct;

                return (
                  <div
                    key={question.id}
                    className={`rounded-md border p-4 ${
                      isCorrect
                        ? "border-green-600/20 bg-green-50 dark:border-green-800/60 dark:bg-green-950/50"
                        : "border-red-600/20 bg-red-50 dark:border-red-800/60 dark:bg-red-950/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">
                        {index + 1}. {question.question}
                      </h4>
                      {isCorrect ? (
                        <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>

                    <div className="mt-2 pl-4">
                      <p className="text-sm font-medium">Your answer:</p>
                      <p
                        className={`text-sm ${isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        {selectedOption
                          ? selectedOption.text
                          : "No answer provided"}
                      </p>

                      {!isCorrect && (
                        <>
                          <p className="mt-2 text-sm font-medium">
                            Correct answer:
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            {question.options.find((o) => o.is_correct)?.text ||
                              "No correct answer found"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <DialogFooter>
              <Button type="button" onClick={handleClose}>
                Close
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Retry Quiz
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
