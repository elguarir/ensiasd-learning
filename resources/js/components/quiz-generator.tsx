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
import { Chapter, ResourceAttachmentFile, SharedData } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import { FileText, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
// Define QuizOption and QuizQuestion types to match the component
interface QuizOption {
  text: string;
  is_correct: boolean;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

type QuizGeneratorProps = {
  onChange: (questions: QuizQuestion[]) => void;
  setView: (view: "quiz-builder" | "quiz-generator") => void;
};

interface PageProps extends SharedData {
  chapters: Chapter[];
}

type ChapterWithPdfs = {
  chapterId: number;
  chapterTitle: string;
  documents: ResourceAttachmentFile[];
};

function QuizGenerator({ onChange, setView }: QuizGeneratorProps) {
  const props = usePage<PageProps>().props;
  const [chaptersWithPdfs, setChaptersWithPdfs] = useState<ChapterWithPdfs[]>(
    [],
  );

  const {
    data,
    setData,
    errors: formErrors,
  } = useForm({
    attachments: [] as number[],
    numberOfQuestions: 10,
    difficulty: "medium",
    additionalInstructions: "",
  });
  const [processing, setProcessing] = useState(false);

  const allDocuments = chaptersWithPdfs.flatMap((chapter) => chapter.documents);
  const hasPdfs = allDocuments.length > 0;

  const toggleResource = (id: number) => {
    setData(
      "attachments",
      data.attachments.includes(id)
        ? data.attachments.filter((resourceId) => resourceId !== id)
        : [...data.attachments, id],
    );
  };

  const generateQuiz = async () => {
    if (data.attachments.length === 0) {
      toast.error("Please select at least one PDF document");
      return;
    }

    if (data.attachments.length > 5) {
      toast.error("You can select up to 5 PDF documents");
      return;
    }

    try {
      setProcessing(true);
      const { data: result }: { data: { questions: QuizQuestion[] } } =
        await axios.post(route("quiz.generate"), data);
      console.log(result);
      setProcessing(false);
      if (result.questions) {
        onChange(result.questions);
        toast.success("Quiz generated successfully!");
        setView("quiz-builder");
      } else {
        toast.error("Failed to generate quiz. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate quiz. Please try again.");
      setProcessing(false);
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <Label className="mb-2 block text-base">Select PDF Documents</Label>
          <p className="text-muted-foreground mb-4 text-sm">
            Choose up to 5 PDF documents to create your quiz from.
          </p>

          <div className="space-y-4">
            {chaptersWithPdfs.map((chapter) => (
              <div key={chapter.chapterId} className="flex flex-col gap-2">
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
            onChange={(e) => setData("additionalInstructions", e.target.value)}
            rows={2}
          />
          {formErrors.additionalInstructions && (
            <p className="text-destructive mt-1 text-sm">
              {formErrors.additionalInstructions}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            disabled={
              processing ||
              data.attachments.length === 0 ||
              data.attachments.length > 5
            }
            variant="outline"
            className="w-full"
            onClick={generateQuiz}
          >
            {processing ? (
              <>
                <Spinner size="sm" className="mr-2" />
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
      </div>
    </div>
  );
}

export default QuizGenerator;
