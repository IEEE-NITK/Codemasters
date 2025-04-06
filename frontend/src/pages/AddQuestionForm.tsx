import { useState,useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import { fetchendpoint, loadCredentials } from "@/services/polygon";
import config from "@/config";

interface QuestionFormData {
  title: string;
  description: string;
  difficulty: string;
  category: string;
  timeLimit: string;
  acceptance: string;
  visibleTestCases:number;
  numTestCases:number;
  exampleInput: object;
  expectedOutput: { [key: string]: string };
  constraintData: string;
  [key: string]: any;
}

export const AddQuestionForm = () => {
  const {id} =useParams();
  const problemId=id;
  console.log(id);

  const [formData, setFormData] = useState<QuestionFormData>({
    title: "",
    description: "",
    difficulty: 'Easy',
    category: "",
    timeLimit: "",
    acceptance: "",
    visibleTestCases:0,
    numTestCases:0,
    exampleInput: {1:""},
    expectedOutput:{1:""},
    constraintData: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState('');
  const [secret, setSecret] = useState('');

  useEffect(() => {
    const creds = loadCredentials();
    setApiKey(creds?.apiKey);
    setSecret(creds?.secret);
  }, []);
  
  useEffect(() => {
    if (apiKey && secret && id) {
      fetchPolygonQuestion();
    }
  }, [apiKey, secret, id]);

  const fetchPolygonQuestion = async () => {
    try {
      setLoading(true);
      console.log("in the loop")
      const data = await fetchendpoint(apiKey,secret,problemId || '','polygon-question');
      console.log("question:",data);
      console.log("out the loop")
      if (data?.QuestionData) {
        setFormData((prev) => ({
            ...prev,
            ...data.QuestionData,
            exampleInput:data.QuestionData.exampleInput || {},  // Ensure it's always an object
            expectedOutput: data.QuestionData.exampleOutput || {}, // Ensure it's always an object
            numTestCases:data.QuestionData.numTestCases
        }));
    }

    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }
}
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: keyof QuestionFormData) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleInputChange =(index:string,value:string)=>{
    const updatedFields= {...formData.exampleInput,[index]:value};
    setFormData({...formData,exampleInput:updatedFields})

  }
  const handleOutputChange =(index:string,value:string)=>{
    const updatedFields= {...formData.expectedOutput,[index]:value};
    setFormData({...formData,expectedOutput:updatedFields})

  }
 

  const addField = () => {
    const newIndex = Object.keys(formData.exampleInput).length + 1;
    setFormData((prev) => ({
      ...prev,
      exampleInput: { ...prev.exampleInput, [newIndex]: "" },
      expectedOutput: { ...prev.expectedOutput, [newIndex]: "" },
      numTestCases:newIndex
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      console.log("formdata",formData)
      const response = await fetch(`${config.HOST}/question/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          title: "",
          description: "",
          difficulty: 'Easy',
          category: "",
          timeLimit: "",
          acceptance: "",
          visibleTestCases:0,
          numTestCases:0,
          exampleInput: {1:""},
          expectedOutput:{1:""},
          constraintData: "",
        });
      } else {
        throw new Error("Failed to submit question");
      }
    } catch (error) {
      console.error("Error adding question:", error);
    }

    setLoading(false);
  };

  if(loading){
    return(
      <div>
        <h1>loading</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black flex justify-center items-center p-6">
      <Card className="max-w-2xl w-full bg-gray-100 text-gray-900 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Add New Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => handleChange(e, "title")} placeholder="Enter question title" />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => handleChange(e, "description")} placeholder="Enter question description" />
            </div>

            <div>
              <Label>Difficulty</Label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleChange(e, "difficulty")}
                className="w-full p-2 border rounded"
              >
                <option value='Easy'>Easy</option>
                <option value='Medium'>Medium</option>
                <option value='Hard'>Hard</option>
              </select>
            </div>

            <div>
              <Label>Category</Label>
              <Input value={formData.category} onChange={(e) => handleChange(e, "category")} placeholder="Enter question category" />
            </div>

            <div>
              <Label>Time Limit</Label>
              <Input value={formData.timeLimit} onChange={(e) => handleChange(e, "timeLimit")} placeholder="Enter time limit" />
            </div>

            <div>
              <Label>Acceptance Rate</Label>
              <Input value={formData.acceptance} onChange={(e) => handleChange(e, "acceptance")} placeholder="Enter acceptance rate" />
            </div>

            <div>
              <Label>Number of Visible Test cases</Label>
              <Input value={formData.visibleTestCases} onChange={(e)=>handleChange(e,"visibleTestCases")} type="number"></Input>
            </div>
            <Label>Test Cases</Label>
            {Object.entries(formData.exampleInput).map(([key, value]) => (
              
        <div key={key} className="">
          <Label className="mb-2 mx-2">{key}</Label>
         <div className="flex gap-4 mb-2"> <Textarea
            placeholder={`Input ${key}`}
            value={value}
            onChange={(e) => handleInputChange(key,e.target.value)}
          />
          <Textarea
            placeholder={`Output ${key}`}
            value={formData.expectedOutput[key] || ""}
            onChange={(e) => handleOutputChange(key, e.target.value)}
          /></div>
        </div>
      ))}

      <Button onClick={addField}>Add</Button>

            <div>
              <Label>Constraint</Label>
              <Textarea value={formData.constraintData} onChange={(e) => handleChange(e, "constraintData")} placeholder="Enter constraint_data" />
            </div>

            <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-600" disabled={loading}>
              {loading ? "Adding..." : "Submit Question"}
            </Button>

            {success && <p className="mt-4 text-green-500">Question Added Successfully!</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddQuestionForm;