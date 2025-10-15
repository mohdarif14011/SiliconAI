import type { LucideIcon } from "lucide-react";
import { Cpu, ShieldCheck, LayoutGrid } from "lucide-react";

export type VlsiRole = {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  image: string;
};

export type Interview = {
  id: string;
  role: string;
  date: string;
  score: number;
  roleSlug: string;
};

export type SkillFeedback = {
  skill: string;
  score: number;
  feedback: string;
};

export type QuestionFeedback = {
  question: string;
  answer: string;
  feedback: string;
  score: number;
};

export type InterviewReport = {
  id: string;
  role: string;
  date: string;
  overallScore: number;
  summary: string;
  strengths: string;
  areasForImprovement: string;
  skillFeedback: SkillFeedback[];
  questionFeedback: QuestionFeedback[];
};

export const ROLES: VlsiRole[] = [
  {
    slug: "design-engineer",
    name: "Design Engineer",
    description: "Focuses on RTL design, architecture, and logic implementation.",
    icon: Cpu,
    image: "design-engineer",
  },
  {
    slug: "verification-engineer",
    name: "Verification Engineer",
    description: "Ensures design correctness through robust testbenches and methodologies.",
    icon: ShieldCheck,
    image: "verification-engineer",
  },
  {
    slug: "physical-design-engineer",
    name: "Physical Design Engineer",
    description: "Transforms RTL design into a manufacturable layout (GDSII).",
    icon: LayoutGrid,
    image: "physical-design-engineer",
  },
];

export const INTERVIEWS: Interview[] = [
  {
    id: "1",
    role: "Design Engineer",
    date: "2024-07-20",
    score: 85,
    roleSlug: "design-engineer",
  },
  {
    id: "2",
    role: "Verification Engineer",
    date: "2024-07-18",
    score: 78,
    roleSlug: "verification-engineer",
  },
  {
    id: "3",
    role: "Design Engineer",
    date: "2024-07-15",
    score: 92,
    roleSlug: "design-engineer",
  },
];

export const MOCK_REPORT: InterviewReport = {
    id: "1",
    role: "Design Engineer",
    date: "2024-07-21",
    overallScore: 82,
    summary: "A strong performance overall, demonstrating solid fundamentals in digital design. Communication was clear, but some answers could benefit from more detailed examples.",
    strengths: "Excellent grasp of state machine design and timing concepts. Your explanation of Verilog constructs was clear and accurate.",
    areasForImprovement: "Deepen knowledge on advanced topics like clock domain crossing (CDC) and low-power design techniques. Practice articulating project experiences with the STAR method.",
    skillFeedback: [
        { skill: "Digital Design", score: 90, feedback: "Excellent." },
        { skill: "Verilog/VHDL", score: 85, feedback: "Very good." },
        { skill: "STA", score: 75, feedback: "Good, but could be more detailed." },
        { skill: "Architecture", score: 80, feedback: "Good." },
        { skill: "Communication", score: 78, feedback: "Clear, but could be more structured." },
    ],
    questionFeedback: [
        {
            question: "Explain the difference between blocking and non-blocking assignments in Verilog.",
            answer: "User's transcribed answer would appear here...",
            feedback: "Correct explanation. You clearly differentiated their use in combinational and sequential logic. To improve, you could have mentioned the simulation race conditions that blocking assignments can cause in sequential blocks.",
            score: 9,
        },
        {
            question: "What is setup and hold time? What happens if they are violated?",
            answer: "User's transcribed answer would appear here...",
            feedback: "You defined setup and hold times correctly. However, your explanation of the consequences (metastability) was a bit vague. A great answer would describe the metastable state and its potential impact on the circuit's downstream logic.",
            score: 7,
        },
        {
            question: "Describe a complex project you worked on and your specific contributions.",
            answer: "User's transcribed answer would appear here...",
            feedback: "Good overview of the project. Your description of your tasks was clear. Using the STAR (Situation, Task, Action, Result) method would make your answer more impactful and easier for an interviewer to follow. For instance, what was the result of your work? Did it improve performance or reduce bugs?",
            score: 8,
        }
    ]
};
