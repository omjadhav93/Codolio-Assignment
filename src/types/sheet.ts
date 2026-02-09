export interface ApiQuestion {
    _id: string;
    sheetId: string;
    questionId: {
        _id: string;
        id: string;
        platform: string;
        slug: string;
        __v: number;
        companyTags: string[];
        createdAt: string;
        description: string;
        difficulty: "Easy" | "Medium" | "Hard";
        name: string;
        problemUrl: string;
        topics: string[];
        updatedAt: string;
        verified: boolean;
        similarQuestions: string[];
    };
    topic: string;
    title: string;
    subTopic: string | null;
    resource: string;
    session: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    popularSheets: string[];
    isSolved: boolean;
    questionDocumentId: string | null;
}

export interface Question {
    id: string;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    problemUrl: string;
    platform: string;
    isSolved: boolean;
}

export interface Topic {
    id: string;
    title: string;
    questions: Question[];
}