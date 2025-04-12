<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\QuizOption;
use App\Models\QuizQuestion;
use Illuminate\Database\Seeder;

class QuizSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Make sure we have assignments before creating quizzes
        $quizAssignments = Assignment::where('type', 'quiz')->get();
        
        if ($quizAssignments->isEmpty()) {
            $this->command->info('Please run AssignmentSeeder first to create quiz assignments');
            return;
        }

        foreach ($quizAssignments as $assignment) {
            // Create 3-8 questions per quiz
            $questionCount = rand(3, 8);
            
            for ($i = 0; $i < $questionCount; $i++) {
                // Create the question
                $question = QuizQuestion::create([
                    'assignment_id' => $assignment->id,
                    'question_text' => $this->getQuestionText($i),
                    'position' => $i + 1,
                    'points' => rand(1, 5), // Random point value between 1-5
                ]);
                
                // Create 2-5 options per question
                $optionCount = rand(2, 5);
                $correctOptionIndex = rand(0, $optionCount - 1); // Randomly set one option as correct
                
                for ($j = 0; $j < $optionCount; $j++) {
                    QuizOption::create([
                        'quiz_question_id' => $question->id,
                        'option_text' => $this->getOptionText($i, $j),
                        'is_correct' => ($j === $correctOptionIndex),
                    ]);
                }
            }
        }

        $this->command->info('Quiz questions and options seeded successfully!');
    }

    private function getQuestionText(int $index): string
    {
        $questions = [
            'What is the primary purpose of this concept?',
            'Which of the following best describes the main function?',
            'What is the correct definition of this term?',
            'Which statement is true regarding this topic?',
            'What is the most important factor to consider?',
            'How does this process work?',
            'What is the relationship between these elements?',
            'Which example best illustrates this principle?',
            'What is the significance of this development?',
            'Why is this approach preferred over alternatives?',
            'Which theory best explains this phenomenon?',
            'What are the implications of this finding?',
            'How would you categorize this element?',
            'What distinguishes this concept from related ideas?',
            'Which method is most effective for this scenario?',
        ];

        return $questions[$index % count($questions)];
    }

    private function getOptionText(int $questionIndex, int $optionIndex): string
    {
        // Array of generic answer options organized by question type
        $optionSets = [
            // Set 1: Purpose/Function answers
            [
                'To facilitate communication between systems',
                'To optimize resource allocation',
                'To ensure data integrity and security',
                'To simplify complex processes',
                'To enhance user experience',
            ],
            // Set 2: Definition answers
            [
                'A systematic approach to problem-solving',
                'A framework for understanding relationships',
                'A method for classifying information',
                'A principle that guides decision-making',
                'A concept that explains observed phenomena',
            ],
            // Set 3: True/False type answers
            [
                'It always operates in a linear fashion',
                'It requires minimal system resources',
                'It functions independently of external factors',
                'It adapts based on environmental conditions',
                'It demonstrates consistent behavior across platforms',
            ],
            // Set 4: Factor/Consideration answers
            [
                'Scalability and performance',
                'Cost-effectiveness and efficiency',
                'Compatibility with existing systems',
                'User adoption and learning curve',
                'Long-term sustainability',
            ],
            // Set 5: Process answers
            [
                'Through iterative cycles of feedback',
                'By applying predetermined algorithms',
                'Through hierarchical decision trees',
                'Via parallel processing of inputs',
                'By sequential analysis of components',
            ],
        ];

        // Select a set based on question index
        $setIndex = $questionIndex % count($optionSets);
        $options = $optionSets[$setIndex];
        
        // Get the option text, or generate a fallback if index is out of bounds
        return $options[$optionIndex % count($options)];
    }
} 