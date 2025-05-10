import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Chapter, ResourceAttachmentFile } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import { CheckCircle, FileText, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { QuizBuilder } from "./quiz-builder";

// Define QuizOption and QuizQuestion types to match the component
interface QuizOption {
  text: string;
  is_correct: boolean;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

// Define the page props type with an index signature to satisfy Inertia constraint
interface PageProps {
  chapters: Chapter[];
  flash?: {
    quiz_response?: {
      success: boolean;
      questions?: QuizQuestion[];
      message?: string;
    };
  };
  [key: string]: any; // Add index signature for Inertia compatibility
}

type Props = {
  onChange: (questions: QuizQuestion[]) => void;
};

type ChapterWithPdfs = {
  chapterId: number;
  chapterTitle: string;
  documents: ResourceAttachmentFile[];
};

function QuizGenerator({ onChange }: Props) {
  const props = usePage<PageProps>().props;
  const [chaptersWithPdfs, setChaptersWithPdfs] = useState<ChapterWithPdfs[]>(
    [],
  );

  const {
    data,
    setData,
    post,
    processing,
    errors: formErrors,
    reset,
  } = useForm({
    attachments: [] as number[],
    numberOfQuestions: 10,
    difficulty: "medium",
    additionalInstructions: "",
  });

  const [generating, setGenerating] = useState(false); // Kept for UI state, though processing from useForm can also be used
  const [error, setError] = useState<string | null>(null); // For general errors not tied to form fields
  const [success, setSuccess] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[]>(
    [],
  );

  useEffect(() => {
    const chaptersWithPdfsData = props.chapters
      .map((chapter) => {
        const pdfDocuments = (chapter.resources || [])
          .filter((resource) => resource.resource_type === "attachment")
          .flatMap((resource) =>
            (resource.metadata?.files || []).filter(
              (file) => file.mime_type === "application/pdf",
            ),
          );

        if (pdfDocuments.length > 0) {
          return {
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            documents: pdfDocuments.map((file) => ({
              id: file.id,
              name: file.name,
              size: file.size,
              mime_type: file.mime_type,
              path: file.path,
            })),
          };
        }
        return null;
      })
      .filter(Boolean) as ChapterWithPdfs[];

    setChaptersWithPdfs(chaptersWithPdfsData);
  }, [props.chapters]);

  const toggleResource = (id: number) => {
    setData(
      "attachments",
      data.attachments.includes(id)
        ? data.attachments.filter((resourceId) => resourceId !== id)
        : [...data.attachments, id],
    );
  };

  const generateQuiz = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data.attachments.length === 0) {
      setError("Please select at least one PDF document");
      return;
    }

    if (data.attachments.length > 5) {
      setError("You can select up to 5 PDF documents");
      return;
    }

    setGenerating(true);
    setError(null);
    setSuccess(false);

    post(route("quiz.generate"), {
      preserveScroll: true,
      onSuccess: () => {
        // Response handled by flash useEffect
        setGenerating(false);
      },
      onError: (pageErrors) => {
        // pageErrors from useForm are automatically handled for fields
        // For general message:
        const generalError = Object.values(pageErrors).find(
          (err) => typeof err === "string",
        );
        setError(generalError || "An error occurred generating the quiz");
        setGenerating(false);
      },
      onFinish: () => {
        setGenerating(false);
      },
    });
  };

  const allDocuments = chaptersWithPdfs.flatMap((chapter) => chapter.documents);
  const hasPdfs = allDocuments.length > 0;

  return (
    <div className="space-y-6">
      <div className="bg-card text-card-foreground rounded-md border p-4 shadow">
        <h3 className="mb-4 text-lg font-medium">Generate Quiz with AI</h3>

        {!hasPdfs ? (
          <p className="text-muted-foreground">
            No PDF documents available. Add PDF documents to your course to
            generate quizzes.
          </p>
        ) : (
          <form onSubmit={generateQuiz} className="space-y-6">
            <div>
              <Label className="mb-2 block text-base">
                Select PDF Documents
              </Label>
              <p className="text-muted-foreground mb-4 text-sm">
                Choose up to 5 PDF documents to create your quiz from. The AI
                will analyze the content and generate relevant questions.
              </p>

              <div className="space-y-4">
                {chaptersWithPdfs.map((chapter) => (
                  <div key={chapter.chapterId} className="space-y-2">
                    <h4 className="text-sm font-medium">
                      {chapter.chapterTitle}
                    </h4>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {chapter.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="hover:bg-muted/30 flex items-center space-x-2 rounded-md border p-2"
                        >
                          <Checkbox
                            id={`doc-${doc.id}`}
                            checked={data.attachments.includes(doc.id)}
                            onCheckedChange={() => toggleResource(doc.id)}
                          />
                          <Label
                            htmlFor={`doc-${doc.id}`}
                            className="flex flex-grow cursor-pointer items-center"
                          >
                            <FileText className="mr-2 h-4 w-4 text-red-500" />
                            <span className="truncate text-sm">{doc.name}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {formErrors.attachments && (
                <p className="text-destructive mt-1 text-sm">
                  {formErrors.attachments}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                <Input
                  id="numberOfQuestions"
                  type="number"
                  min={1}
                  max={20}
                  value={data.numberOfQuestions}
                  onChange={(e) =>
                    setData("numberOfQuestions", parseInt(e.target.value) || 10)
                  }
                />
                {formErrors.numberOfQuestions && (
                  <p className="text-destructive mt-1 text-sm">
                    {formErrors.numberOfQuestions}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={data.difficulty}
                  onValueChange={(value) => setData("difficulty", value)}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.difficulty && (
                  <p className="text-destructive mt-1 text-sm">
                    {formErrors.difficulty}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInstructions">
                Additional Instructions (Optional)
              </Label>
              <Textarea
                id="additionalInstructions"
                placeholder="Add any specific instructions for the AI..."
                value={data.additionalInstructions}
                onChange={(e) =>
                  setData("additionalInstructions", e.target.value)
                }
                rows={2}
              />
              {formErrors.additionalInstructions && (
                <p className="text-destructive mt-1 text-sm">
                  {formErrors.additionalInstructions}
                </p>
              )}
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  processing ||
                  generating ||
                  data.attachments.length === 0 ||
                  data.attachments.length > 5
                }
              >
                {processing || generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Quiz
                  </>
                )}
              </Button>
            </div>

            {success && !processing && !generating && (
              <div className="text-primary mt-2 flex items-center text-sm">
                <CheckCircle className="mr-1 h-4 w-4" />
                Quiz successfully generated!
              </div>
            )}
          </form>
        )}
      </div>

      {generatedQuestions.length > 0 && (
        <div className="bg-card text-card-foreground rounded-md border p-6 shadow">
          <QuizBuilder
            questions={generatedQuestions}
            onChange={(questions) => {
              setGeneratedQuestions(questions);
              onChange(questions); // Propagate to parent
            }}
          />
        </div>
      )}
    </div>
  );
}

export default QuizGenerator;
