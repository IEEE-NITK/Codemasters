import React from 'react';
import { Code2, Play, Send, Book, Terminal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Language {
  value: string;
  version: string;
  label: string;
  defaultCode: string;
}

interface TaskResponse {
  message: string;
  taskId?: string;
  error?: string;
}

interface TaskResult {
  status: string;
  output?: string;
  error?: string;
}

interface CodeFile {
  name: string;
  content: string;
}

interface CodeSubmission {
  id: number;
  language: string;
  version: string;
  files: CodeFile[];
}

const languages: Language[] = [
  {
    value: 'python',
    version: '3.10.0',
    label: 'Python',
    defaultCode: `def solve(nums, target):
    # Your solution here
    return []`,
  },
  {
    value: 'javascript',
    version: '16.14.0',
    label: 'JavaScript',
    defaultCode: `function solve(nums, target) {
  // Your solution here
  return [];
}`,
  },
  {
    value: 'typescript',
    version: '4.8.4',
    label: 'TypeScript',
    defaultCode: `function solve(nums: number[], target: number): number[] {
  // Your solution here
  return [];
}`,
  },
];



export default function CodeEditor() {
  const [language, setLanguage] = React.useState<string>(languages[0].value);
  const [code, setCode] = React.useState<string>(languages[0].defaultCode);
  const [isRunning, setIsRunning] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [showEditorial, setShowEditorial] = React.useState<boolean>(false);
  const [output, setOutput] = React.useState<string>('');
  const [currentTaskId, setCurrentTaskId] = React.useState<string | null>(null);

  const getLanguageVersion = (langValue: string): string => {
    return languages.find(lang => lang.value === langValue)?.version || '3.10.0';
  };

  const prepareSubmission = (sourceCode: string): CodeSubmission => {
    const selectedLanguage = languages.find(lang => lang.value === language);
    return {
      
      id: 1,
      language: language,
      version: selectedLanguage?.version || '3.10.0',
      files: [
        {
          name: `solution.${language === 'python' ? 'py' : 'js'}`,
          content: sourceCode
        }
      ]
    };
  };

  // Function to submit code to the backend
  const submitCode = async (): Promise<string | null> => {
    try {
      console.log("hit")
      console.log(code);
      const submission = prepareSubmission(code);
      
      const response = await fetch('http://localhost:3000/task/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      const data: TaskResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit code');
      }

      return data.taskId || null;
    } catch (error) {
      console.error('Error submitting code:', error);
      throw error;
    }
  };

  // Function to fetch task results
  const fetchTaskResult = async (taskId: string): Promise<TaskResult> => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/tasks/${taskId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch task result');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching result:', error);
      throw error;
    }
  };

  // Poll for results
  const pollForResults = async (taskId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout
    
    const poll = async () => {
      if (attempts >= maxAttempts) {
        throw new Error('Timeout waiting for results');
      }

      const result = await fetchTaskResult(taskId);
      if (result.status === 'completed') {
        return result;
      } else if (result.status === 'error') {
        throw new Error(result.error || 'Task failed');
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return poll();
    };

    return poll();
  };

  const handleLanguageChange = (value: string) => {
    const selectedLang = languages.find(lang => lang.value === value);
    if (selectedLang) {
      setLanguage(value);
      setCode(selectedLang.defaultCode);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running code...');

    try {
      const taskId = await submitCode();
      if (!taskId) {
        throw new Error('No task ID received');
      }

      setCurrentTaskId(taskId);
      const result = await pollForResults(taskId);
      
      setOutput(result.output || 'No output received');
      toast.success('Code executed successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute code';
      setOutput(`Error: ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput('Submitting solution...');

    try {
      const taskId = await submitCode();
      if (!taskId) {
        throw new Error('No task ID received');
      }

      setCurrentTaskId(taskId);
      const result = await pollForResults(taskId);
      
      setOutput(result.output || 'Solution submitted successfully');
      toast.success('Solution submitted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit solution';
      setOutput(`Error: ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // JSX remains the same as before...
  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <Code2 className="h-6 w-6" />
        <h1 className="text-2xl font-bold">CodeMaster</h1>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Problem Statement Card - Same as before */}
        <Card className="col-span-12 lg:col-span-4">
          {/* ... Problem statement content remains the same ... */}
        </Card>

        {/* Code Editor and Output Section */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Card>
            <CardHeader className="space-y-0 pb-4">
              <div className="flex items-center space-x-4">
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label} ({lang.version})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex-1" />

                <Button
                  onClick={handleRun}
                  disabled={isRunning}
                  variant="secondary"
                >
                  {isRunning ? (
                    <>Running...</>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  variant="default"
                >
                  {isSubmitting ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono min-h-[400px] resize-none"
                placeholder="Write your code here..."
              />
            </CardContent>
          </Card>

          {/* Output Terminal */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4" />
                <CardTitle className="text-sm">Output</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg whitespace-pre-wrap font-mono text-sm">
                {output || 'Run your code to see the output...'}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}