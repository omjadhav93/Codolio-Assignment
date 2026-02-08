export interface ApiQuestion {
    _id: string;
    title: string;
    topic: string;
    subTopic: string | null;
    isSolved: boolean;
    resource: string;
    questionId: {
        name: string;
        difficulty: "Easy" | "Medium" | "Hard";
        problemUrl: string;
        platform: string;
        topics: string[];
    };
}

export interface Question {
    id: string;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    problemUrl: string;
    isSolved: boolean;
}

export interface Topic {
    id: string;
    title: string;
    questions: Question[];
}